import { useAuth } from '../context/JWTAuthContext';

export default function Header({ userName }: { userName?: string }) {
  const { user } = useAuth();
  const displayName = userName !== undefined ? userName : (user?.name || 'User');

  return (
    <header className="page-header">
      <h1>Welcome back, {displayName}.</h1>
      <p>3-day streak — Today's goal: 60 minutes.</p>
    </header>
  );
}