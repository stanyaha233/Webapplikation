import { useState, useEffect } from "react";
import { User } from "./interfaces";



export default function getUserData() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 1. Daten aus dem Local Storage als String abrufen
    const storedUserData = localStorage.getItem('userData');

    if (storedUserData) {
      // 2. Den JSON-String wieder in ein Objekt umwandeln und im State speichern
      setUser(JSON.parse(storedUserData));
    }
  }, []);
  user && console.log('Aktueller User:', user);
  return (
    user
  );
}