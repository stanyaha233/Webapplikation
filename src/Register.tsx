import { useState } from 'react';
import './style.css';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Register_Set1 from './components/register/Register_Set1';
import Register_Set2 from './components/register/Register_Set2';
import Register_Set3 from './components/register/Register_Set3';
import { Link } from 'react-router-dom';
import type { User } from './types/interfaces';

export default function Register() {
  const [step, setStep] = useState(1);

  const [userData, setUserData] = useState<User>({
    id: 0,
    name: '',
    email: '',
    password: '',
    studyType: ''
  });

  return (
    <div className="page-layout">
      <Sidebar />
      
      <main className="page-main">
        <div className="card" style={{ background: 'var(--streak-light)', border: '1px solid var(--streak)' }}>
            <p>🎉 Du bist der <strong className="highlight" style={{ color: 'var(--streak)' }}>1.337.</strong> User!</p>
        </div>

        {/* Bedingtes Rendern der Schritte basierend auf dem State */}
        {step === 1 && (
            <Register_Set1 onNext={(data) => {
                setUserData({ ...userData, ...data });
                setStep(2);
            }} />
        )}
        
        {step === 2 && (
            <Register_Set2 onNext={(studyType) => {
                userData.studyType = studyType as User['studyType'];
                const finalData = { ...userData };
                setUserData(finalData);
                console.log('Registrierung komplett:', finalData);
                
                // Hier könnte später z.B. der API-Aufruf an das Backend / die Datenbank folgen
                setStep(3);
            }} />
        )}

        {step === 3 && (
            <Register_Set3 userData={userData} />
        )}

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
                <button type="button" style={{ background: 'none', border: '1px solid var(--blue-dark)', color: 'var(--blue-dark)', padding: '0.5rem 1rem', cursor: 'pointer' }}>
                    Already have an account? Log in
                </button>
            </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}