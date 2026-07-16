import '../styles/style.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import ScrollPicker from '../components/ScrollPicker';
import { useState, useEffect } from 'react';

const STUDY_QUOTES = [
  { text: "Stay focused, go after your dreams and keep moving toward your goals.", author: "Unknown" },
  { text: "Der Langsamste, der sein Ziel nicht aus den Augen verliert, geht noch immer geschwinder als jener, der ohne Ziel umherirrt.", author: "Gotthold Ephraim Lessing" },
  { text: "Erfolg ist die Summe kleiner Anstrengungen, die Tag für Tag wiederholt werden.", author: "Robert Collier" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Do not wait for inspiration; be the inspiration.", author: "Unknown" },
  { text: "Your talent determines what you can do. Your motivation determines how much you are willing to do. Your attitude determines how well you do it.", author: "Lou Holtz" }
];

export default function Timer() {
    // 1: Settings, 2: Active Timer, 3: Reflection
    const [step, setStep] = useState(1);

    const [prepMinutes, setPrepMinutes] = useState(10);
    const [studyMinutes, setStudyMinutes] = useState(30);
    const [breakMinutes, setBreakMinutes] = useState(5);
    const [numBlocks, setNumBlocks] = useState(4);
    const [showQuotes, setShowQuotes] = useState(true);

    // 'prep' | 'study' | 'break'
    const [timerMode, setTimerMode] = useState<'prep' | 'study' | 'break'>('prep');
    const [currentBlock, setCurrentBlock] = useState(1);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [elapsedGlobalSeconds, setElapsedGlobalSeconds] = useState(0);
    const [feedback, setFeedback] = useState('flow');
    const [startTime, setStartTime] = useState<string | null>(null);
    const [endTime, setEndTime] = useState<string | null>(null);

    const saveSession = async () => {
        // Calculate actual study duration in seconds
        let actualStudySeconds = 0;
        if (timerMode === 'study') {
            actualStudySeconds = (currentBlock - 1) * studyMinutes * 60 + (studyMinutes * 60 - timeLeft);
        } else if (timerMode === 'break') {
            actualStudySeconds = currentBlock * studyMinutes * 60;
        } else if (timerMode === 'prep') {
            actualStudySeconds = 0;
        }

        // Calculate actual break duration in seconds
        let actualBreakSeconds = 0;
        if (timerMode === 'break') {
            actualBreakSeconds = (currentBlock - 1) * breakMinutes * 60 + (breakMinutes * 60 - timeLeft);
        } else if (timerMode === 'study' || timerMode === 'prep') {
            actualBreakSeconds = Math.max(0, currentBlock - 1) * breakMinutes * 60;
        }

        // Map feedback 'stress' to backend 'overwhelmed'
        const mappedFeedback = feedback === 'stress' ? 'overwhelmed' : feedback;

        try {
            const response = await fetch("/api/session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    duration: actualStudySeconds,
                    breakTime: actualBreakSeconds,
                    starttime: startTime || new Date().toISOString(),
                    endtime: endTime || new Date().toISOString(),
                    progress: Math.round(globalProgress),
                    afterFeeling: mappedFeedback,
                }),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Fehler beim Speichern der Session");
            }

            const data = await response.json();
            console.log("Session erfolgreich gespeichert:", data);

            // Trigger custom event to notify Sidebar/Dashboard to reload sessions
            window.dispatchEvent(new Event("session-saved"));
        } catch (error) {
            console.error("Fehler beim Speichern der Session:", error);
        } finally {
            setStep(1);
            setFeedback('flow');
            setStartTime(null);
            setEndTime(null);
        }
    };

    // Calculate current phase total
    let currentPhaseTotal = 0;
    if (timerMode === 'prep') currentPhaseTotal = prepMinutes * 60;
    else if (timerMode === 'study') currentPhaseTotal = studyMinutes * 60;
    else if (timerMode === 'break') currentPhaseTotal = breakMinutes * 60;

    // Local circular progress
    const localProgress = currentPhaseTotal > 0 ? ((currentPhaseTotal - timeLeft) / currentPhaseTotal) * 100 : 0;

    // Global progress
    const totalGlobalSeconds = (prepMinutes * 60) + (numBlocks * studyMinutes * 60) + (Math.max(0, numBlocks - 1) * breakMinutes * 60);
    const currentPhaseElapsed = step === 3 && timeLeft === 0 ? 0 : currentPhaseTotal - timeLeft; // Don't double count if finished
    let globalProgress = totalGlobalSeconds > 0 ? ((elapsedGlobalSeconds + currentPhaseElapsed) / totalGlobalSeconds) * 100 : 0;
    globalProgress = Math.min(100, globalProgress); // Clamp to 100%

    const playSound = () => {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.5);

        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 1);
    };

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (step === 2 && isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (step === 2 && isActive && timeLeft === 0) {
            playSound();
            setIsActive(false);

            // Phase completed, add its duration to global elapsed time
            setElapsedGlobalSeconds(prev => prev + currentPhaseTotal);

            if (timerMode === 'prep') {
                setTimerMode('study');
                setTimeLeft(studyMinutes * 60);
                setIsActive(true); // Auto-start next phase
            } else if (timerMode === 'study') {
                if (currentBlock < numBlocks) {
                    setTimerMode('break');
                    setTimeLeft(breakMinutes * 60);
                    setIsActive(true); // Auto-start break
                } else {
                    setEndTime(new Date().toISOString());
                    setStep(3); // Go to reflection after all blocks are done
                }
            } else if (timerMode === 'break') {
                setTimerMode('study');
                setCurrentBlock(prev => prev + 1);
                setTimeLeft(studyMinutes * 60);
                setIsActive(true); // Auto-start next study block
            }
        }

        return () => clearInterval(interval);
    }, [step, isActive, timeLeft, timerMode, breakMinutes, studyMinutes, currentBlock, numBlocks, currentPhaseTotal]);

    const handleStart = () => {
        setStartTime(new Date().toISOString());
        setEndTime(null);
        // Skip prep phase if set to 0
        if (prepMinutes > 0) {
            setTimerMode('prep');
            setTimeLeft(prepMinutes * 60);
        } else {
            setTimerMode('study');
            setTimeLeft(studyMinutes * 60);
        }
        setCurrentBlock(1);
        setElapsedGlobalSeconds(0);
        setIsActive(true);
        setStep(2);
    };

    const handleCancel = () => {
        setIsActive(false);
        setEndTime(new Date().toISOString());
        setStep(3); // Skip to reflection
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Calculate segments for the progress bar
    const segments = [];
    if (prepMinutes > 0) {
        segments.push({ type: 'prep', duration: prepMinutes * 60 });
    }
    for (let i = 0; i < numBlocks; i++) {
        segments.push({ type: 'study', duration: studyMinutes * 60 });
        if (i < numBlocks - 1 && breakMinutes > 0) {
            segments.push({ type: 'break', duration: breakMinutes * 60 });
        }
    }

    return (
        <div className="page-layout">
            <Header />
            <Sidebar />
            <main className="page-main">
                {step === 1 && (
                    <>
                        <nav aria-label="Timer settings" className="settings-panel">
                            <h1>Session Setup</h1>
                            <div className="settings-grid">
                                <div className="slider-container">
                                    <div className="slider-header">
                                        <label>Preparation</label>
                                        <span className="slider-value">{prepMinutes} min</span>
                                    </div>
                                    <ScrollPicker value={prepMinutes} onChange={setPrepMinutes} min={0} max={120} />
                                </div>
                                <div className="slider-container">
                                    <div className="slider-header">
                                        <label>Study Blocks</label>
                                        <span className="slider-value">{numBlocks}</span>
                                    </div>
                                    <ScrollPicker value={numBlocks} onChange={setNumBlocks} min={1} max={60} />
                                </div>
                                <div className="slider-container">
                                    <div className="slider-header">
                                        <label>Study Time</label>
                                        <span className="slider-value">{studyMinutes} min</span>
                                    </div>
                                    <ScrollPicker value={studyMinutes} onChange={setStudyMinutes} min={5} max={120} />
                                </div>
                                <div className="slider-container">
                                    <div className="slider-header">
                                        <label>Break Time</label>
                                        <span className="slider-value">{breakMinutes} min</span>
                                    </div>
                                    <ScrollPicker value={breakMinutes} onChange={setBreakMinutes} min={1} max={120} />
                                </div>
                            </div>
                            <div className="settings-checkbox" style={{ marginTop: "1.5rem" }}>
                                <label className="toggle-label">
                                    <input type="checkbox" className="hidden-checkbox" checked={showQuotes} onChange={(e) => setShowQuotes(e.target.checked)} />
                                    <div className="toggle-switch"></div>
                                    Show Quotes
                                </label>
                            </div>
                        </nav>

                        <div className="preparation-box" style={{ marginTop: "2rem" }}>
                            <h3>Preparation Checklist</h3>
                            <ul>
                                <li>Open a window</li>
                                <li>Grab a drink</li>
                                <li>Phone away</li>
                            </ul>
                        </div>

                        <section className="timer-section" style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}>
                            <button className="button" onClick={handleStart}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                                Start Focus Session
                            </button>
                        </section>
                    </>
                )}

                {step === 2 && (
                    <section className="timer-section" style={{ textAlign: "center", marginTop: "2rem" }}>
                        <div className="global-progress" style={{ marginBottom: "2rem", textAlign: "left" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--ink-soft)" }}>
                                <span>Total Session Progress</span>
                                <span>{Math.round(globalProgress)}%</span>
                            </div>
                            <div style={{ display: "flex", width: "100%", height: "10px", backgroundColor: "var(--paper)", borderRadius: "5px", overflow: "hidden", gap: "2px" }}>
                                {(() => {
                                    let accumulatedSeconds = 0;
                                    const currentTotalElapsed = elapsedGlobalSeconds + currentPhaseElapsed;
                                    return segments.map((seg, idx) => {
                                        const segStart = accumulatedSeconds;
                                        const segEnd = accumulatedSeconds + seg.duration;
                                        accumulatedSeconds += seg.duration;

                                        let fillPercent = 0;
                                        if (currentTotalElapsed >= segEnd) {
                                            fillPercent = 100;
                                        } else if (currentTotalElapsed > segStart) {
                                            fillPercent = ((currentTotalElapsed - segStart) / seg.duration) * 100;
                                        }

                                        const color = seg.type === 'study' ? 'var(--blue)' : 'var(--ink-muted)';

                                        return (
                                            <div key={idx} style={{ width: `${(seg.duration / totalGlobalSeconds) * 100}%`, height: "100%", backgroundColor: "rgba(0,0,0,0.05)", position: "relative" }}>
                                                <div style={{ width: `${fillPercent}%`, height: "100%", backgroundColor: color, transition: "width 1s linear" }}></div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>

                        <h2>
                            {timerMode === 'prep' && 'Preparation'}
                            {timerMode === 'study' && `Deep Work (Block ${currentBlock}/${numBlocks})`}
                            {timerMode === 'break' && `Break Time`}
                        </h2>

                        <div style={{
                            position: "relative",
                            width: "200px",
                            height: "200px",
                            margin: "2rem auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                            background: `conic-gradient(var(--accent-color, #4CAF50) ${localProgress}%, #e0e0e0 ${localProgress}%)`
                        }}>
                            <div style={{
                                width: "180px",
                                height: "180px",
                                backgroundColor: "var(--bg-color, white)",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <strong style={{ fontSize: "3rem" }}>{formatTime(timeLeft)}</strong>
                            </div>
                        </div>

                        <p>
                            {timerMode === 'prep' && 'Get ready!'}
                            {timerMode === 'study' && 'Focus session'}
                            {timerMode === 'break' && 'Rest and recharge'}
                            {' · you have '}{formatTime(timeLeft)}{' left'}
                        </p>

                        <div className="timer-controls" style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
                            <button className="button" onClick={() => setIsActive(!isActive)}>
                                {isActive ? (
                                    <><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg> Pause</>
                                ) : (
                                    <><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg> Resume</>
                                )}
                            </button>
                            <button className="button" style={{ backgroundColor: "#ff9800", color: "white" }} onClick={() => {
                                setTimeLeft(0);
                                setIsActive(true);
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" /></svg>
                                Skip
                            </button>
                            <button className="button" style={{ backgroundColor: "#f44336", color: "white" }} onClick={handleCancel}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z" /></svg>
                                {timerMode === 'study' ? 'Abort Session' : 'Finish Early'}
                            </button>
                        </div>

                        {showQuotes && timerMode === 'study' && (
                            <blockquote className="quote-box" style={{ marginTop: "3rem" }}>
                                <p>"{STUDY_QUOTES[(currentBlock - 1) % STUDY_QUOTES.length].text}"</p>
                                <cite>— {STUDY_QUOTES[(currentBlock - 1) % STUDY_QUOTES.length].author}</cite>
                            </blockquote>
                        )}
                    </section>
                )}

                {step === 3 && (
                    <section className="reflection-card" style={{ marginTop: "3rem", marginBottom: "3rem" }}>
                        <h2>Session Reflection</h2>
                        <p style={{ color: "var(--ink-muted)", marginBottom: "2rem" }}>Great job! Your flow data has been recorded.</p>

                        <div style={{ textAlign: "left", marginBottom: "2rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", fontSize: "0.95rem" }}>
                                <span>Total Completed</span>
                                <span style={{ color: "var(--blue-dark)" }}>{Math.round(globalProgress)}%</span>
                            </div>
                            <div className="reflection-progress-bar">
                                <div className="reflection-progress-fill" style={{ width: `${Math.round(globalProgress)}%` }}></div>
                            </div>
                        </div>

                        <div style={{ textAlign: "left" }}>
                            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>How did it feel?</h3>
                            <div className="feedback-grid">
                                <label className={`feedback-option ${feedback === 'stress' ? 'active' : ''}`}>
                                    <input type="radio" name="flow" value="stress" className="hidden-radio" onChange={() => setFeedback('stress')} checked={feedback === 'stress'} />
                                    <span className="feedback-emoji">🤯</span>
                                    Overwhelmed
                                </label>
                                <label className={`feedback-option ${feedback === 'flow' ? 'active' : ''}`}>
                                    <input type="radio" name="flow" value="flow" className="hidden-radio" onChange={() => setFeedback('flow')} checked={feedback === 'flow'} />
                                    <span className="feedback-emoji">🌊</span>
                                    In the flow
                                </label>
                                <label className={`feedback-option ${feedback === 'tired' ? 'active' : ''}`}>
                                    <input type="radio" name="flow" value="tired" className="hidden-radio" onChange={() => setFeedback('tired')} checked={feedback === 'tired'} />
                                    <span className="feedback-emoji">🥱</span>
                                    Understimulated
                                </label>
                            </div>
                        </div>

                        <button className="button" style={{ marginTop: "2.5rem", width: "100%" }} onClick={saveSession}>
                            Save & Back to Settings
                        </button>
                    </section>
                )}
            </main>
            <Footer />
        </div>
    );
}