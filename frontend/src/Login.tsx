import './style.css';
import Footer from './Footer';
import { Link } from 'react-router-dom';

export default function Login() {
  const title = 'Anmelden';
  document.title = title;
  return (
    <div className="page-layout">
      <main className="page-main">
        <h1>Anmelden</h1>
        <div className="card">
          <form action="login.php" method="post">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <label style={{ width: '120px' }}>Nutzername</label>
              <input type="text" name="username" required />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <label style={{ width: '120px' }}>Passwort</label>
              <input type="password" name="password" required />
            </div>
            <button type="submit">Einloggen</button>
          </form>
        </div>
        <Link to="/register" className="register-link">
          Noch kein Konto? Registrieren
        </Link>
      </main>
      <Footer />
    </div>
  );
}