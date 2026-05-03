import './style.css';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Register() {
  return (
    <div className="page-layout">
      {/* Wiederverwendete Sidebar */}
      <Sidebar />
      
      <main className="page-main">
        {/* Inline-Styles werden zu JavaScript-Objekten: style={{ key: 'value' }} */}
        <div className="card" style={{ background: 'var(--streak-light)', border: '1px solid var(--streak)' }}>
            <p>🎉 Du bist der <strong className="highlight" style={{ color: 'var(--streak)' }}>1.337.</strong> User!</p>
        </div>

        {/* Noch reines HTML-Verhalten ohne React-Logik */}
        <form>
            <div className="card">
                <h2>Registrierung</h2>
                <input type="text" placeholder="Name" required />
                <br />
                <input type="email" placeholder="E-Mail-Adresse" required />
                <input type="password" placeholder="Passwort" required />
            </div>

            <div className="card">
                <h2>Wie lernst du normalerweise?</h2>
                <label className="radio-option">
                    <input type="radio" name="study-type" value="sprinter" />
                    <span><strong style={{ color: 'var(--blue-dark)' }}>Sprinter:</strong> Kurz und intensiv</span>
                </label>
                <br /><br />
                <label className="radio-option">
                    <input type="radio" name="study-type" value="marathon" />
                    <span><strong style={{ color: 'var(--blue-dark)' }}>Marathonläufer:</strong> Stundenlang und stetig</span>
                </label>
                <br /><br />
                <label className="radio-option">
                    <input type="radio" name="study-type" value="hero" />
                    <span><strong style={{ color: 'var(--blue-dark)' }}>Last-Minute-Hero:</strong> Hoher Druck nötig</span>
                </label>
            </div>

            <button type="submit" className="submit-btn">Account erstellen</button>
            
            {/* Das onclick="window.location.href..." habe ich entfernt, da wir das später mit dem React Router lösen */}
            <button type="button" style={{ background: 'none', border: '1px solid var(--blue-dark)', color: 'var(--blue-dark)' }}>
                Already have an account? Log in
            </button>
        </form>
      </main>
      
      {/* Footer ergänzt für ein vollständiges Grid-Layout */}
      <Footer />
    </div>
  );
}