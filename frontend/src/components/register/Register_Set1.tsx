import { useState } from 'react';

interface RegisterSet1Props {
  onNext: (data: { name: string; email: string; password: string }) => void;
}

export default function Register_Set1({ onNext }: RegisterSet1Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="card">
      <h2>Registrierung</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        <input
          type="email"
          placeholder="E-Mail-Adresse"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>
      <button
        type="button"
        className="submit-btn"
        onClick={() => onNext({ name, email, password })}
      >
        Weiter
      </button>
    </div>
  );
}
