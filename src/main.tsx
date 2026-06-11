import { createRoot } from 'react-dom/client'
import './style.css'
import App from '../App'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from './Dashboard';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Timer from './Timer';


const router = createBrowserRouter([
    {
        path: "/", // Basis-Pfad
        element: <App />, // gemeinsames Layout (Rahmen)
        children: [ // verschachtelte Routen
            { index: true, element: <Home /> }, // "/" exakt
            { path: "dashboard", element: <Dashboard /> }, // "/dashboard"
            { path:"timer", element: <Timer /> }, // "/timer"
            { path: "login", element: <Login /> }, // "/login"
            { path: "register", element: <Register /> }, // "/register"
        ]
    }
]);

createRoot(document.getElementById("root")!).render(
    <RouterProvider router={router} />
);
