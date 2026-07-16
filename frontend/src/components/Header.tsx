import { useAuth } from '../context/JWTAuthContext';

export default function Header({ userName, streak }: { userName?: string, streak?: number }) {
  const { user } = useAuth();
  const displayName = userName !== undefined ? userName : (user?.name || 'User');

  return (
    <header className="page-header">
      <h1>Welcome back, {displayName}.</h1>
      {streak !== undefined ? (
        <p>Your streak: {streak} — Keep it up! 🔥</p>
      ) : (
        <p>Start a focus session to build your study streak!</p>
      )}
    </header>
  );
}