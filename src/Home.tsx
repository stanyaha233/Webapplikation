import './style.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User }from './types/interfaces'

export default function Home() {
    const [user, setUser] = useState<User | null>({ id: 1, name: 'Hanna', email: 'Stella', password: '', studyType: '' });

    const studyStats = [
      { day: 'Montag', minutes: 120 },
      { day: 'Dienstag', minutes: 90 },
      { day: 'Mittwoch', minutes: 0 },
    ];

  return (
    <div className="page-layout">
      <Header userName={user?.name || ''} />
      <Sidebar />
      <main className="page-main">
        <section aria-labelledby="stats-title">
          <h2 id="stats-title">Diese Woche: 21 Minuten</h2>
          <ul className="stats-list">
            {studyStats.map((stat, index) => (
              <li key={index}>{stat.day}: {stat.minutes} Min</li>
            ))}
          </ul>
          
          <article className="focus-card">
            <h3>Start Focus Mode</h3>
            <p>Ablenkungsfrei · Deep Work</p>
            <Link to="/timer" className="button">Fokus starten</Link>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}