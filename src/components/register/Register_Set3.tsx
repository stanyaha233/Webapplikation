import type { User } from '../../types/interfaces';


export default function Register_Set3({ userData }: { userData: User }) {
    
    return (
        <div className="card">
            <h2>Registrierung abgeschlossen!</h2>
            <p>🎉 Du bist der <strong className="highlight" style={{ color: 'var(--streak)' }}>1.337.</strong> User!</p>
            <p> Herzlich Willkommen {userData.name}!</p>
            </div>
    );
}