import './style.css';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Dashboard() {
  return (
    <div className="page-layout">
      <header className="page-header">
        <h1>Lern-Dashboard</h1>
      </header>
      
      <Sidebar /> //wegen grid layout!

      <main className="page-main">
        <div className="card">
          <h2>Vergleichbarkeit</h2>
          <p>
            Beim Onboarding sagtest du, du bist selten im Flow. In den letzten 7 Tagen warst du es aber <span className="highlight">3-mal</span>! Weiter so.🔥
          </p>
        </div>
        <div className="card">
          <h2>Monats-Review </h2>
          <p>Alle Daten ausgewertet: Du hast diesen Monat insgesamt 24 Fokus-Sessions absolviert.</p>
        </div>
        <div className="card">
          <h2>Optimale Lernzeit</h2>
          <p>Analyse läuft... (3/5 Sessions abgeschlossen)</p>
          <p className="status-loading">Noch 2 Sessions bis zur ersten Prognose.</p>
        </div>
        <div className="card">
          <h2>Dein Lerntyp</h2>
          <p>Status: <span className="highlight">Typ Abendlerner</span></p>
          <p className="small-text">Basierend auf deinen letzten 10 Sessions (Typ: Morgen/Mittag/Abend).</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}