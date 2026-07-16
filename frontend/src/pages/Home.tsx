import '../styles/style.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/JWTAuthContext';
import { sessionService } from '../services/sessionService';
import { useEffect, useState } from 'react';
import { Session } from '../types/interfaces';


export default function Home() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    async function loadSessions() {
      try {
        const data = await sessionService.getSessions();
        setSessions(data);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      }
    }
    loadSessions();
  }, []);
  // Calculate consecutive study days (streak)
  const streak = (() => {
    if (sessions.length === 0) return 0;

    const sortedSessions = [...sessions].sort(
      (a, b) => new Date(b.endtime).getTime() - new Date(a.endtime).getTime()
    );

    const uniqueDates = Array.from(
      new Set(sortedSessions.map(s => new Date(s.endtime).toDateString()))
    ).map(dStr => new Date(dStr));

    if (uniqueDates.length === 0) return 0;

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const mostRecentDate = uniqueDates[0];
    const isToday = mostRecentDate.toDateString() === today.toDateString();
    const isYesterday = mostRecentDate.toDateString() === yesterday.toDateString();

    if (!isToday && !isYesterday) return 0;

    let currentStreak = 0;
    let expectedDate = new Date(mostRecentDate);

    for (let i = 0; i < uniqueDates.length; i++) {
      if (uniqueDates[i].toDateString() === expectedDate.toDateString()) {
        currentStreak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }
    return currentStreak;
  })();

  // Generate study stats for the last 7 days dynamically
  const studyStats = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index);

    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

    const daySessions = sessions.filter(session => {
      const sessionDate = new Date(session.endtime);
      return sessionDate.toDateString() === date.toDateString();
    });

    const minutes = Math.round(daySessions.reduce((total, session) => total + session.duration, 0) / 60);

    return { day: dayName, minutes };
  }).reverse();

  const totalMinutesThisWeek = studyStats.reduce((total, stat) => total + stat.minutes, 0);

  return (
    <div className="page-layout">
      <Header userName={user?.name} streak={streak} />
      <Sidebar />
      <main className="page-main">
        <section aria-labelledby="stats-title">
          <h2 id="stats-title">This Week: {totalMinutesThisWeek} Minutes</h2>
          <ul className="stats-list">
            {studyStats.map((stat, index) => (
              <li key={index}>{stat.day}: {stat.minutes} min</li>
            ))}
          </ul>

          <article className="focus-card">
            <h3>Start Focus Mode</h3>
            <p>Distraction-free · Deep Work</p>
            <Link to="/timer" className="button">Start Focus</Link>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}
