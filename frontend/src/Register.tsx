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

        {step === 1 && (
          <Register_Set1 onNext={(data) => {
            setUserData({ ...userData, ...data });
            setStep(2);
          }} />
        )}
        {step === 2 && (
          <Register_Set2 onNext={async (studyType) => {
            userData.studyType = studyType as User['studyType'];
            const finalData = { ...userData };

            try {
              const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name: finalData.name,
                  email: finalData.email,
                  password: finalData.password,
                  studyType: finalData.studyType,
                }),
              });

              if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Registrierung fehlgeschlagen');
              }

              const result = await response.json();

              // ID vom Server im State eintragen
              finalData.id = result.user.id;
              setUserData(finalData);

              console.log('Erfolgreich registriert:', finalData);
              Storage.prototype.setItem.call(localStorage, 'userData', JSON.stringify(finalData));
              setStep(3);
            } catch (error) {
              console.error('Fehler bei der Registrierung:', error);
              alert(error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten.');
            }
          }} />
        )}


        {step === 3 && (
          <Register_Set3 userData={userData} />
        )}

        {step !== 3 && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button type="button" style={{ background: 'none', border: '1px solid var(--blue-dark)', color: 'var(--blue-dark)', padding: '0.5rem 1rem', cursor: 'pointer' }}>
                Already have an account? Log in
              </button>
            </Link>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}