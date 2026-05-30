import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './src/Home';
import Register from './src/Register';
import Login from './src/Login';
import Timer from './src/Timer';
import Dashboard from './src/Dashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
