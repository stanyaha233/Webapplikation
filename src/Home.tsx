import './style.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Home() {
  return (
    <div className="page-layout">
      <Header />
      <Sidebar />
      <main className="page-main">
        <section aria-labelledby="stats-title">
          <h2 id="stats-title">Diese Woche: 21 Minuten</h2>
          <ul className="stats-list">
            <li>Mo: 0 Min</li>
            <li>Di: 1 Min</li>
            <li>Mi: 2 Min</li>
            <li>Do: 3 Min</li>
            <li>Fr: 4 Min</li>
            <li>Sa: 5 Min</li>
            <li>So: 6 Min</li>
          </ul>
          
          <article className="focus-card">
            <h3>Start Focus Mode</h3>
            <p>Ablenkungsfrei · Deep Work</p>
            <a href="#timer.html" className="button">Fokus starten</a>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}