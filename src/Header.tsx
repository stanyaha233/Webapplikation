export default function Header({ userName = 'User' }: { userName?: string }) {
  
  return (
    <header className="page-header">
      <h1>Welcome back, {userName}.</h1>
      <p>3-day streak — Today's goal: 60 minutes.</p>
    </header>
  );
}