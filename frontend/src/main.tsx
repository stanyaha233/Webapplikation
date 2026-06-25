import { createRoot } from 'react-dom/client'
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


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <Home /> },
            { path: "home", element: <Home /> }, // "/home"
            { path: "dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> }, // "/dashboard"
            { path: "timer", element: <ProtectedRoute><Timer /></ProtectedRoute> }, // "/timer"
            { path: "login", element: <Login /> }, // "/login"
            { path: "register", element: <Register /> }, // "/register"
        ]
    }
]);

createRoot(document.getElementById("root")!).render(
    <RouterProvider router={router} />
);
