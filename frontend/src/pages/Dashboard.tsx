import '../styles/style.css';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function Dashboard() {
  return (
    <div className="page-layout">
      <header className="page-header">
        <h1>Learning Dashboard</h1>
      </header>

      <Sidebar /> //wegen grid layout!

      <main className="page-main">
        <div className="card">
          <h2>Comparison</h2>
          <p>
            During onboarding you said you are rarely in flow. But you were in flow <span className="highlight">3 times</span> in the last 7 days! Keep it up.🔥
          </p>
        </div>
        <div className="card">
          <h2>Monthly Review</h2>
          <p>All data analyzed: You completed a total of 24 focus sessions this month.</p>
        </div>
        <div className="card">
          <h2>Optimal Study Time</h2>
          <p>Analysis in progress... (3/5 sessions completed)</p>
          <p className="status-loading">2 more sessions until the first prognosis.</p>
        </div>
        <div className="card">
          <h2>Your Learner Type</h2>
          <p>Status: <span className="highlight">Evening Learner</span></p>
          <p className="small-text">Based on your last 10 sessions (Type: Morning/Afternoon/Evening).</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}