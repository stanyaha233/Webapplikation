import { useEffect, useState } from 'react';
import { Session } from '../types/interfaces';
import '../styles/style.css';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useAuth } from '../context/JWTAuthContext';
import { sessionService } from "../services/sessionService";

export default function Dashboard() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  let flowCountLast7Days = 0

  useEffect(() => {
    async function loadSessions() {
      try {
        const data = await sessionService.getSessions();
        setSessions(data);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSessions();
  }, []);

  flowCountLast7Days = sessions.filter(session => session.afterFeeling === 'flow' && new Date(session.endtime).getTime() >= Date.now() - 7 * 24 * 60 * 60 * 1000).length;

  // Chart data for the last 7 days (including today)
  const chartData = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index);
    const dayName = date.toLocaleDateString('de-DE', { weekday: 'short' });
    
    const daySessions = sessions.filter(session => {
      const sessionDate = new Date(session.endtime);
      return sessionDate.toDateString() === date.toDateString();
    });

    const totalSeconds = daySessions.reduce((total, s) => total + s.duration, 0);
    const minutes = Math.round(totalSeconds / 60);

    const avgProgress = daySessions.length > 0
      ? Math.round(daySessions.reduce((total, s) => total + s.progress, 0) / daySessions.length)
      : 0;

    let dominantFeeling = "";
    if (daySessions.length > 0) {
      const counts = { flow: 0, tired: 0, overwhelmed: 0 };
      daySessions.forEach(s => {
        if (s.afterFeeling in counts) {
          counts[s.afterFeeling as keyof typeof counts]++;
        }
      });
      if (counts.flow >= counts.tired && counts.flow >= counts.overwhelmed) {
        dominantFeeling = "flow";
      } else if (counts.tired >= counts.flow && counts.tired >= counts.overwhelmed) {
        dominantFeeling = "tired";
      } else {
        dominantFeeling = "overwhelmed";
      }
    }

    return {
      day: dayName,
      minutes,
      avgProgress,
      feeling: dominantFeeling,
      dateStr: date.toLocaleDateString('de-DE', { day: 'numeric', month: 'numeric' })
    };
  }).reverse();

  const maxMinutes = Math.max(...chartData.map(d => d.minutes), 60);

  // Best Time of Day
  const timeOfDayAnalysis = (() => {
    if (sessions.length === 0) return null;
    let morningSum = 0, morningCount = 0;
    let afternoonSum = 0, afternoonCount = 0;
    let eveningSum = 0, eveningCount = 0;

    sessions.forEach(session => {
      const hour = new Date(session.starttime).getHours();
      const progress = session.progress;
      if (hour >= 5 && hour <= 11) {
        morningSum += progress;
        morningCount++;
      } else if (hour >= 12 && hour <= 17) {
        afternoonSum += progress;
        afternoonCount++;
      } else {
        eveningSum += progress;
        eveningCount++;
      }
    });

    const morningAvg = morningCount > 0 ? morningSum / morningCount : 0;
    const afternoonAvg = afternoonCount > 0 ? afternoonSum / afternoonCount : 0;
    const eveningAvg = eveningCount > 0 ? eveningSum / eveningCount : 0;

    const avgs = [
      { name: "Morgen (05-12 Uhr)", avg: morningAvg, count: morningCount },
      { name: "Nachmittag (12-18 Uhr)", avg: afternoonAvg, count: afternoonCount },
      { name: "Abend/Nacht (18-05 Uhr)", avg: eveningAvg, count: eveningCount }
    ].filter(item => item.count > 0);

    if (avgs.length === 0) return null;
    avgs.sort((a, b) => b.avg - a.avg);
    return avgs[0];
  })();

  // Best Block Duration
  const durationAnalysis = (() => {
    if (sessions.length === 0) return null;
    let shortSum = 0, shortCount = 0;
    let medSum = 0, medCount = 0;
    let longSum = 0, longCount = 0;

    sessions.forEach(session => {
      const minutes = session.duration / 60;
      const progress = session.progress;

      if (minutes <= 25) {
        shortSum += progress;
        shortCount++;
      } else if (minutes <= 50) {
        medSum += progress;
        medCount++;
      } else {
        longSum += progress;
        longCount++;
      }
    });

    const shortAvg = shortCount > 0 ? shortSum / shortCount : 0;
    const medAvg = medCount > 0 ? medSum / medCount : 0;
    const longAvg = longCount > 0 ? longSum / longCount : 0;

    const groups = [
      { label: "Kurze Einheiten (bis 25 Min)", avg: shortAvg, count: shortCount },
      { label: "Mittlere Einheiten (25-50 Min)", avg: medAvg, count: medCount },
      { label: "Lange Einheiten (über 50 Min)", avg: longAvg, count: longCount }
    ].filter(g => g.count > 0);

    if (groups.length === 0) return null;
    groups.sort((a, b) => b.avg - a.avg);
    return groups[0];
  })();

  // Optimal Study Time Recommendation
  const optimalStudyTimeCalc = (() => {
    if (sessions.length < 5) {
      return {
        ready: false,
        text: `Analyse läuft... (${sessions.length}/5 Sessions abgeschlossen).`,
        subtext: `${5 - sessions.length} weitere Sessions bis zur ersten Prognose.`
      };
    }

    const highEfficiencySessions = sessions.filter(
      session => session.afterFeeling === "flow" && session.progress >= 70
    );

    if (highEfficiencySessions.length >= 3) {
      const avg = Math.round(
        highEfficiencySessions.reduce((sum, s) => sum + s.duration, 0) /
        highEfficiencySessions.length / 60
      );
      const avgProg = Math.round(
        highEfficiencySessions.reduce((sum, s) => sum + s.progress, 0) /
        highEfficiencySessions.length
      );
      return {
        ready: true,
        minutes: avg,
        text: `Deine produktivsten Phasen (guter Flow + Zielerreichung ab 70%) dauern durchschnittlich ${avg} Minuten.`,
        subtext: `Bei diesen Einheiten hast du im Schnitt ${avgProg}% deiner Ziele erreicht.`
      };
    }

    const flowSessions = sessions.filter(session => session.afterFeeling === "flow");
    if (flowSessions.length >= 3) {
      const avg = Math.round(
        flowSessions.reduce((sum, s) => sum + s.duration, 0) /
        flowSessions.length / 60
      );
      return {
        ready: true,
        minutes: avg,
        text: `Deine produktiven Flow-Phasen dauern durchschnittlich ${avg} Minuten.`,
        subtext: `Es liegen noch nicht genügend kombinierte Daten (Flow + hohe Zielerreichung) vor, daher basiert diese Prognose rein auf dem Flow-Gefühl.`
      };
    }

    const highProgressSessions = sessions.filter(session => session.progress >= 70);
    if (highProgressSessions.length >= 3) {
      const avg = Math.round(
        highProgressSessions.reduce((sum, s) => sum + s.duration, 0) /
        highProgressSessions.length / 60
      );
      return {
        ready: true,
        minutes: avg,
        text: `Einheiten mit hoher Zielerreichung (>= 70%) dauern bei dir durchschnittlich ${avg} Minuten.`,
        subtext: `Erfasse weiterhin deine Gefühle nach dem Lernen, um genauere Flow-Analysen freizuschalten.`
      };
    }

    return {
      ready: true,
      text: "Es liegen noch nicht genügend repräsentative Sessions vor (mind. 3 Sessions in einer Kategorie benötigt).",
      subtext: "Lerne weiter mit dem Timer, um deine optimale Zeit zu ermitteln."
    };
  })();

  if (loading) {
    return (
      <div className="page-layout">
        <header className="page-header">
          <h1>Learning Dashboard</h1>
        </header>
        <Sidebar />
        <main className="page-main">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-layout">
      <header className="page-header">
        <h1>Learning Dashboard</h1>
      </header>

      <Sidebar />

      <main className="page-main">
        {/* Wöchentlicher Study-Überblick */}
        <div className="card" style={{ gridColumn: "span 1" }}>
          <h2>Wöchentlicher Study-Überblick</h2>
          <p style={{ color: "var(--ink-muted)", marginBottom: "1.5rem" }}>
            Deine Lernaktivität und Zielerreichung der letzten 7 Tage.
          </p>
          
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            height: "180px",
            padding: "1rem 0",
            borderBottom: "1px solid var(--blue-pale)",
            gap: "8px",
            marginBottom: "1.5rem"
          }}>
            {chartData.map((dayData, idx) => {
              const barHeight = (dayData.minutes / maxMinutes) * 120;
              const emoji = dayData.feeling === "flow" ? "🌊" : dayData.feeling === "tired" ? "🥱" : dayData.feeling === "overwhelmed" ? "🤯" : "";
              
              return (
                <div key={idx} style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                  justifyContent: "flex-end"
                }}>
                  {dayData.minutes > 0 && (
                    <span style={{ fontSize: "0.7rem", fontWeight: "600", color: "var(--blue-dark)", marginBottom: "4px" }}>
                      {dayData.minutes}m
                    </span>
                  )}
                  
                  <div style={{
                    width: "100%",
                    height: `${barHeight}px`,
                    backgroundColor: dayData.minutes > 0 ? "var(--blue)" : "rgba(0,0,0,0.02)",
                    borderRadius: "4px 4px 0 0",
                    transition: "height 0.5s ease",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "4px 0",
                    boxSizing: "border-box",
                    minHeight: dayData.minutes > 0 ? "35px" : "4px"
                  }}>
                    {dayData.minutes > 0 && (
                      <>
                        <span style={{ fontSize: "0.75rem" }} title="Dominantes Gefühl">{emoji}</span>
                        <span style={{
                          fontSize: "0.65rem",
                          fontWeight: "bold",
                          color: "var(--white)",
                          backgroundColor: "rgba(0,0,0,0.25)",
                          padding: "1px 3px",
                          borderRadius: "3px",
                          lineHeight: 1
                        }} title="Durchschnittliche Zielerreichung">
                          {dayData.avgProgress}%
                        </span>
                      </>
                    )}
                  </div>
                  
                  <span style={{ fontSize: "0.7rem", color: "var(--ink-soft)", fontWeight: "500", marginTop: "6px" }}>
                    {dayData.day}
                  </span>
                  <span style={{ fontSize: "0.6rem", color: "var(--ink-muted)" }}>
                    {dayData.dateStr}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-soft)", margin: "0.5rem 0 0.25rem 0" }}>
              Lern-Analyse
            </h3>
            
            {sessions.length === 0 ? (
              <p style={{ color: "var(--ink-muted)", fontStyle: "italic" }}>
                Noch keine Daten vorhanden. Starte deinen ersten Timer, um eine Analyse zu sehen!
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem" }}>
                {timeOfDayAnalysis && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                    <span style={{ fontSize: "1.1rem" }}>⏰</span>
                    <div>
                      <strong>Beste Lernzeit:</strong> Am erfolgreichsten lernst du am <strong>{timeOfDayAnalysis.name}</strong> (durchschnittlich <strong>{Math.round(timeOfDayAnalysis.avg)}%</strong> Zielerreichung).
                    </div>
                  </div>
                )}

                {durationAnalysis && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                    <span style={{ fontSize: "1.1rem" }}>⏳</span>
                    <div>
                      <strong>Beste Blocklänge:</strong> Deine Ziele erreichst du am besten bei <strong>{durationAnalysis.label}</strong> (durchschnittlich <strong>{Math.round(durationAnalysis.avg)}%</strong> Zielerreichung).
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.1rem" }}>🔥</span>
                  <div>
                    <strong>Fokus & Flow:</strong> In den letzten 7 Tagen warst du {flowCountLast7Days} Mal im Flow!
                    {flowCountLast7Days > 0 
                      ? " Nutze deine ermittelte optimale Study-Time, um dieses Niveau zu halten." 
                      : " Lerne weiter, um deinen Rhythmus zu finden und das Flow-Gefühl zu aktivieren."}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2>Comparison</h2>
          <p>
            {user?.studyType == 'sprinter' ? "During Onboarding you said that you are a sprinter. "
              : user?.studyType == 'marathon' ? "During Onboarding you said that you are a marathon runner. "
                : user?.studyType == 'hero' ? "During Onboarding you said that you are a last minute hero. "
                  : ""
            }
            But you were in flow <span className="highlight">{flowCountLast7Days} times</span> in the last 7 days! Keep it up.🔥
          </p>
        </div>

        <div className="card">
          <h2>Monthly Review</h2>
          <p> You studied {sessions.filter(session => new Date(session.endtime).getTime() >= Date.now() - 30 * 24 * 60 * 60 * 1000).length} times this month</p>
          <p>You studied for {Math.round(sessions.filter(session => new Date(session.endtime).getTime() >= Date.now() - 30 * 24 * 60 * 60 * 1000).reduce((total, session) => total + session.duration, 0) / 60)} minutes this month</p>
        </div>

        <div className="card">
          <h2>Optimal Study Time</h2>
          {!optimalStudyTimeCalc.ready ? (
            <>
              <p>{optimalStudyTimeCalc.text}</p>
              <p className="status-loading">{optimalStudyTimeCalc.subtext}</p>
            </>
          ) : (
            <>
              {"Analyse:"}
              <p style={{ marginTop: "0.5rem" }}>{optimalStudyTimeCalc.text}</p>
              <p style={{ color: "var(--ink-muted)", fontSize: "0.75rem", marginTop: "0.25rem" }}>{optimalStudyTimeCalc.subtext}</p>
            </>
          )}
        </div>

        <div className="card">
          <h2>Your Learner Type</h2>
          {sessions.length < 10 ?
            "Discover your Learner Type! You unlock it when you locked 10 Sessions so keep it up! You need " + (10 - sessions.length) + " more sessions."
            :
            <>
              {(() => {
                let eveningCount = sessions.filter((session) => new Date(session.starttime).getHours() >= 18 || new Date(session.starttime).getHours() <= 4).length;
                let morningCount = sessions.filter((session) => new Date(session.starttime).getHours() >= 5 && new Date(session.starttime).getHours() <= 11).length;
                let afternoonCount = sessions.filter((session) => new Date(session.starttime).getHours() >= 12 && new Date(session.starttime).getHours() <= 17).length;
                if (eveningCount > morningCount && eveningCount > afternoonCount) {
                  return "You are an Evening Learner.";
                } else if (morningCount > eveningCount && morningCount > afternoonCount) {
                  return "You are a Morning Learner.";
                } else {
                  return "You are an Afternoon Learner.";
                }
              })()}
            </>
          }
        </div>
      </main>

      <Footer />
    </div>
  );
}