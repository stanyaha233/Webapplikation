import './style.css';
import Footer from './Footer';

export default function Login() {
  return (
    <div className="page-layout">
      <main className="page-main">
        <h1>Anmelden</h1>
        <div className="card">
          {/* Noch reines HTML-Verhalten ohne React-Logik */}
          <form action="login.php" method="post">
            <label>Nutzername</label>
            <input type="text" name="username" required />
            <br />
            <label>Passwort</label>
            <input type="password" name="password" required />
            <br />
            <button type="submit">Einloggen</button>
          </form>
        </div>
        <button className="secondary">
          Noch kein Konto? Registrieren
        </button>
      </main>
      <Footer />
    </div>
  );
}