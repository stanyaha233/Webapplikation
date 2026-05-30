import './style.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Home() {
  const [studyStats, setStudyStats] = useState([
    { day: 'Mo', minutes: 0 },
    { day: 'Di', minutes: 1 },
    { day: 'Mi', minutes: 2 },
    { day: 'Do', minutes: 3 },
    { day: 'Fr', minutes: 4 },
    { day: 'Sa', minutes: 5 },
    { day: 'So', minutes: 6 },
  ]);

  const totalMinutes = studyStats.reduce((acc, curr) => acc + curr.minutes, 0);

  return (
    <div className="page-layout">
      <Header />
      <Sidebar />
      <main className="page-main">
        <section aria-labelledby="stats-title">
          <h2 id="stats-title">Diese Woche: {totalMinutes} Minuten</h2>
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