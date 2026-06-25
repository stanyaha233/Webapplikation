import '../styles/style.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/JWTAuthContext';


export default function Home() {
  const { user } = useAuth();

  const studyStats = [
    { day: 'Monday', minutes: 120 },
    { day: 'Tuesday', minutes: 90 },
    { day: 'Wednesday', minutes: 0 },
  ];

  return (
    <div className="page-layout">
      <Header />
      <Sidebar />
      <main className="page-main">
        <section aria-labelledby="stats-title">
          <h2 id="stats-title">This Week: 21 Minutes</h2>
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
