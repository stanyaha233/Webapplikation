import { createRoot } from 'react-dom/client'
<<<<<<< Updated upstream
import './style.css'
import App from '../App'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from './Dashboard';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Timer from './Timer';
=======
import './styles/style.css'
import App from './App'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Timer from './pages/Timer';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorPage from './components/ErrorPage';
>>>>>>> Stashed changes


const router = createBrowserRouter([
    {
<<<<<<< Updated upstream
        path: "/", // Basis-Pfad
        element: <App />, // gemeinsames Layout (Rahmen)
        children: [ // verschachtelte Routen
            { index: true, element: <Home /> }, // "/" exakt
            { path: "home", element: <Home /> }, // "/home"
            { path: "dashboard", element: <Dashboard /> }, // "/dashboard"
            { path:"timer", element: <Timer /> }, // "/timer"
=======
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <Home /> },
            { path: "home", element: <Home /> }, // "/home"
            { path: "dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> }, // "/dashboard"
            { path: "timer", element: <ProtectedRoute><Timer /></ProtectedRoute> }, // "/timer"
>>>>>>> Stashed changes
            { path: "login", element: <Login /> }, // "/login"
            { path: "register", element: <Register /> }, // "/register"
        ]
    }
]);

createRoot(document.getElementById("root")!).render(
    <RouterProvider router={router} />
);
