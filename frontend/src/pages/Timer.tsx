import '../styles/style.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';

export default function Timer() {
    const [step, setStep] = useState(1);
    const [timeLeft, setTimeLeft] = useState(1800);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (step === 2 && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [step, timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="page-layout">
            <Header />
            <Sidebar />
            <main className="page-main">
                {step === 1 && (
                    <>
                        <nav aria-label="Timer settings">
                            <h1>Settings</h1>
                            <ul>
                                <li>Focus · 25 min</li>
                                <li>Short Break · 5 min</li>
                                <li>Long Break · 15 min</li>
                            </ul>
                            <div className="settings-checkbox">
                                <label>
                                    <input type="checkbox" defaultChecked /> Quotes
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
                            <div className="timer-display"><strong>{formatTime(timeLeft)}</strong></div>
                            <img alt="timer" style={{ width: "15rem" }} src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F009%2F304%2F537%2Flarge_2x%2Fdigital-timer-clipart-design-illustration-free-png.png&f=1&nofb=1&ipt=255315f8397dd20f59b7968a113e8acda94ad3680b231608aa4a3862b38d22bb" />
                            <p>Focus session · you have {formatTime(timeLeft)} left</p>

                            <blockquote className="quote-box">
                                <p>"Stay focused, go after your dreams and keep moving toward your goals."</p>
                                <cite>— Unknown</cite>
                            </blockquote>

                            <button className="button" onClick={() => setStep(2)}>◉ Start Focus Session</button>
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
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
}