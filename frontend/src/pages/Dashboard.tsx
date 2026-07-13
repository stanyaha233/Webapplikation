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

  flowCountLast7Days = sessions.filter(session => new Date(session.endtime).getTime() >= Date.now() - 7 * 24 * 60 * 60 * 1000).length;
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

      <Sidebar /> //wegen grid layout!

      <main className="page-main">
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
          {sessions.length < 5 ?
            <>
              <p>Analysis in progress... ({sessions.length}/5 sessions completed)</p>
              <p className="status-loading">{5 - sessions.length} more sessions until the first prognosis.</p>
            </>
            : <>
              {"Analyse:"}
              {(sessions.filter((session) => session.afterFeeling == "flow").length > 0) ?
                <p>Du hattest {sessions.filter((session) => session.afterFeeling == "flow").length} mal ein tolles Gefühl nach dem Lernen.</p>
                : ""}
              {(sessions.filter((session) => session.afterFeeling == "overwhelmed").length > 0) ?
                <p>Du hattest {sessions.filter((session) => session.afterFeeling == "overwhelmed").length} mal ein gestresstes Gefühl nach dem Lernen.</p>
                : ""}
              {(sessions.filter((session) => session.afterFeeling == "tired").length > 0) ?
                <p>Du hattest {sessions.filter((session) => session.afterFeeling == "tired").length} mal ein müdes Gefühl nach dem Lernen.</p>
                : ""}
              { }

            </>

          }
        </div>
        <div className="card">
          <h2>Your Learner Type</h2>
          {sessions.length < 10 ?
            "Discover your Learner Type! You unlock it when you locked 10 Sessions so keep it up! You need " + (10 - sessions.length) + " more sessions." :
            <>
              <p>Status: <span className="highlight">Evening Learner</span></p>
              <p>Based on your last 10 sessions (Type: Morning/Afternoon/Evening).</p>
            </>
          }
        </div>
      </main>

      <Footer />
    </div>
  );
}