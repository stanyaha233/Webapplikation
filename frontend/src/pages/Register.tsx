import '../styles/style.css';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Register_Set1 from '../components/register/Register_Set1';
import Register_Set2 from '../components/register/Register_Set2';
import Register_Set3 from '../components/register/Register_Set3';
import { Link } from 'react-router-dom';
import type { User } from '../types/interfaces';
import { useAuth } from '../context/JWTAuthContext';
import { useState } from 'react';

export default function Register() {
  const [step, setStep] = useState(1);
  const { register, login, loading, error, setError } = useAuth();

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
          <p>🎉 You are user number <strong className="highlight" style={{ color: 'var(--streak)' }}>1,337</strong>!</p>
        </div>

        {error && (
          <div style={{ color: '#d9534f', margin: '0.5rem 0', fontWeight: 'bold' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <p className="status-loading">Registration in progress... Please wait.</p>
          </div>
        ) : (
          <>
            {step === 1 && (
              <Register_Set1 onNext={(data) => {
                setUserData({ ...userData, ...data });
                setStep(2);
              }} />
            )}
            {step === 2 && (
              <Register_Set2 onNext={async (studyType) => {
                const finalData = { ...userData, studyType: studyType as User['studyType'] };
                setError(null);

                try {
                  await register(finalData.name, finalData.email, finalData.password, finalData.studyType ?? '');
                  await login(finalData.email, finalData.password);

                  setUserData(finalData);
                  console.log('Successfully registered and logged in:', finalData);
                  setStep(3);
                } catch (err) {
                  console.error('Error during registration:', err);
                }
              }} />
            )}

            {step === 3 && (
              <>
                <Register_Set3 userData={userData} />
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                  <Link to="/dashboard">
                    <button type="button" className="submit-btn" style={{ padding: '0.75rem 2rem', fontSize: '1rem', cursor: 'pointer' }}>
                      Go to Dashboard
                    </button>
                  </Link>
                </div>
              </>
            )}
          </>
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