import { Routes, Route } from 'react-router-dom';
import Home from './src/Home';
import Register from './src/Register';
import Login from './src/Login';
import Timer from './src/Timer';
import Dashboard from './src/Dashboard';
import { Link } from "react-router-dom";


export default function App() {
  return (
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/timer">Timer</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/timer" element={<Timer />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
  );
}