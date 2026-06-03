import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="page-sidebar">
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/timer">Timer</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
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