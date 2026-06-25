import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/JWTAuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <aside className="page-sidebar">
      <ul>
        <li><Link to="/home">Home</Link></li>
        {!user && <li><Link to="/login">Login</Link></li>}
        {user && (
          <>
            <li><Link to="/timer">Timer</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li>
              <button 
                onClick={handleLogout} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--blue-dark)', 
                  font: 'inherit', 
                  cursor: 'pointer', 
                  padding: 0,
                  transition: 'color 0.2s ease',
                  textAlign: 'left'
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = 'var(--blue)')}
                onMouseOut={(e) => (e.currentTarget.style.color = 'var(--blue-dark)')}
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
      <section className="calendar" aria-labelledby="cal-title">
        <h2 id="cal-title" className="visually-hidden"> streak tracker</h2>
        <time dateTime="2026-04">April 2026</time>
        
        <ul role="list" className="calendar-grid">
          <li>● ● ● ● ● ● ●</li>
          <li>● X ● ● ● X ●</li>
          <li>● X X X X X X</li>
        </ul>
        <p><strong>9 Tage gelernt</strong></p>
      </section>
    </aside>
  );
}