import './style.css';
import Footer from './Footer';
import { Link } from 'react-router-dom';

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
        <Link to="/register">
          Noch kein Konto? Registrieren
        </Link>
      </main>
      <Footer />
    </div>
  );
}