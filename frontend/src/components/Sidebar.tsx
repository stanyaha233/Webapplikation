import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/JWTAuthContext';
import { sessionService } from '../services/sessionService';
import { Session } from '../types/interfaces';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const currentMonthName = new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });

  const navigate = useNavigate();

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const sessionsThisMonth = sessions.filter(session => {
    const d = new Date(session.starttime);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  const calendarCells: { dayNumber: number | null; isStudyDay: boolean }[] = [];

  const studyDaysThisMonth = Array.from(
    new Set(sessionsThisMonth.map(session => new Date(session.starttime).getDate()))
  );

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const firstDayOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  for (let i = 0; i < firstDayOffset; i++) {
    calendarCells.push({ dayNumber: null, isStudyDay: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push({
      dayNumber: day,
      isStudyDay: studyDaysThisMonth.includes(day)
    });
  }

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      navigate('/login');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    async function loadSessions() {
      try {
        const data = await sessionService.getSessions();
        setSessions(data);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      }
    }
    loadSessions();

    window.addEventListener("session-saved", loadSessions);
    return () => {
      window.removeEventListener("session-saved", loadSessions);
    };
  }, []);

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Sidebar schließen" : "Sidebar öffnen"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      <aside className={`page-sidebar ${isOpen ? 'is-open' : ''}`}>
        <ul>
          <li><Link to="/home" onClick={closeSidebar}>Home</Link></li>
          {!user && <li><Link to="/login" onClick={closeSidebar}>Login</Link></li>}
          {user && (
            <>
              <li><Link to="/timer" onClick={closeSidebar}>Timer</Link></li>
              <li><Link to="/dashboard" onClick={closeSidebar}>Dashboard</Link></li>
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
          <time dateTime="" style={{ textTransform: 'capitalize' }}>{currentMonthName}</time>

          <div className="calendar-weekdays">
            <span>M</span>
            <span>D</span>
            <span>M</span>
            <span>D</span>
            <span>F</span>
            <span>S</span>
            <span>S</span>
          </div>

          <ul role="list" className="calendar-grid">
            {calendarCells.map((cell, idx) => {
              if (cell.dayNumber === null) {
                return <li key={`empty-${idx}`} className="calendar-day empty"></li>;
              }
              return (
                <li
                  key={cell.dayNumber}
                  className={`calendar-day ${cell.isStudyDay ? 'studied' : 'not-studied'}`}
                  title={cell.isStudyDay ? `Gelernt am ${cell.dayNumber}.` : `${cell.dayNumber}.`}
                >
                  {cell.isStudyDay ? 'X' : '●'}
                </li>
              );
            })}
          </ul>
          <p><strong>{studyDaysThisMonth.length} Tage diesen Monat gelernt</strong></p>
        </section>
      </aside >
    </>
  );
}