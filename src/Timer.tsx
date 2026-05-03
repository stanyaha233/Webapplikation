import './style.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Timer() {
    return (
        <div className="page-layout">
            <Header />
            <Sidebar />
            <main className="page-main">
                <nav aria-label="Timer-Einstellungen">
                    <h1>Settings</h1>
                    <ul>
                        <li>Focus · 25 min</li>
                        <li>Short Break · 5 min</li>
                        <li>Long Break · 15 min</li>
                    </ul>
                    <div className="settings-checkbox">
                        <label>
                        <input type="checkbox" checked /> Quotes
                        </label>
                    </div>
                </nav>

                <div className="preparation-box">
                    <h3>Preparation</h3>
                    <ul>
                        <li>Open a window</li>
                        <li>Grab a drink</li>
                        <li>Quick stretch</li>
                        <li>Phone away</li>
                    </ul>
                </div>

                <section className="timer-section">
                    <h2>Deep Work</h2>
                    <div className="timer-display"><strong>30:00</strong></div>
                    <img alt="timer" style={{ width: "15rem" }} src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F009%2F304%2F537%2Flarge_2x%2Fdigital-timer-clipart-design-illustration-free-png.png&f=1&nofb=1&ipt=255315f8397dd20f59b7968a113e8acda94ad3680b231608aa4a3862b38d22bb" />
                    <p>Focus session · you have 30 min left</p>
                    
                    <blockquote className="quote-box">
                        <p>"Stay focused, go after your dreams and keep moving toward your goals."</p>
                        <cite>— Unbekannt</cite>
                    </blockquote>

                    <button className="button">◉ Start Focus Session</button>
                </section>

                <hr />

                <section className="reflection-section">
                    <h2>Session Reflection</h2>
                    <div className="calender">
                        <strong>you have a total of 847 minutes of Flow Time</strong>
                    </div>
                    
                    <div className="progress-container">
                        <label htmlFor="flow-progress">Session Progress: 60%</label>
                        <progress id="flow-progress" value="60" max="100"></progress>
                    </div>

                    <div className="feedback-container">
                        <h3>How did it feel?</h3>
                        <label><input type="radio" name="flow" value="stress" /> Overwhelmed</label><br />
                        <label><input type="radio" name="flow" value="flow" defaultChecked /> In the flow</label><br />
                        <label><input type="radio" name="flow" value="bored" /> Understimulated</label>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}