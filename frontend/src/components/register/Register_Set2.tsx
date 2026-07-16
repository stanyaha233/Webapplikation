import React from 'react';

interface RegisterSet2Props {
    onNext: (studyType: string) => void;
}

export default function Register_Set2({ onNext }: RegisterSet2Props) {
    const [studyType, setStudyType] = React.useState('');

    return (
        <div className="card">
            <h2>Registrierung</h2>
            <div style={{ marginBottom: '1rem' }}>
                <form>
                    <h2>Wie lernst du normalerweise?</h2>

                    <label className="radio-option">
                        <input type="radio" name="study-type" value="sprinter" onChange={() => setStudyType('sprinter')} />
                        <span><strong style={{ color: 'var(--blue-dark)' }}>Sprinter:</strong> Kurz und intensiv</span>
                    </label>
                    <br />
                    <br />
                    <label className="radio-option">
                        <input type="radio" name="study-type" value="marathon" onChange={() => setStudyType('marathon')} />
                        <span><strong style={{ color: 'var(--blue-dark)' }}>Marathonläufer:</strong> Stundenlang und stetig</span>
                    </label>
                    <br />
                    <br />
                    <label className="radio-option">
                        <input type="radio" name="study-type" value="hero" onChange={() => setStudyType('hero')} />
                        <span><strong style={{ color: 'var(--blue-dark)' }}>Last-Minute-Hero:</strong> Hoher Druck nötig</span>
                    </label>
                    <br />
                    <button
                        type="button"
                        className="submit-btn"
                        onClick={() => onNext(studyType)}
                        disabled={!studyType}
                        style={{
                            opacity: !studyType ? 0.5 : 1,
                            cursor: !studyType ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Weiter
                    </button>
                </form>
            </div>



        </div>
    );
}
