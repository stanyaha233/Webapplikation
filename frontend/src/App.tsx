import { Outlet } from "react-router-dom";
import { AuthProvider } from "./context/JWTAuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
