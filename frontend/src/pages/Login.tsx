import { useState, FormEvent } from 'react';
import '../styles/style.css';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/JWTAuthContext';

export default function Login() {
  const title = 'Login';
  document.title = title;

  const { login, loading, error, setError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
    }
  };

  return (
    <div className="page-layout">
      <main className="page-main">
        <h1>Login</h1>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <label style={{ width: '120px' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ flex: 1, padding: '0.5rem' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <label style={{ width: '120px' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ flex: 1, padding: '0.5rem' }}
              />
            </div>
            {error && (
              <div style={{ color: '#d9534f', marginBottom: '1rem', fontWeight: 'bold' }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
        <Link to="/register" className="register-link">
          No account yet? Register
        </Link>
      </main>
      <Footer />
    </div>
  );
}