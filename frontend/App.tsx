import { Outlet } from "react-router-dom";

export default function App() {
  // Die App.tsx lädt nun einfach über <Outlet /> das, was in der main.tsx 
  // unter "children" definiert ist (also Home, Dashboard, etc.).
  return <Outlet />;
}
