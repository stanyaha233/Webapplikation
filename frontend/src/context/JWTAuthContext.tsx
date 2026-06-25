import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { User } from "../types/interfaces";

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, studyType: string) => Promise<void>;
  clearError: () => void;
  loadUser: () => Promise<void>;
}

function extractErrorMessage(text: string): string {
  try {
    const json = JSON.parse(text);
    return json.error || text;
  } catch {
    return text;
  }
}

export function getErrorMessage(text: string): string {
  return extractErrorMessage(text);
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        let errMsg = "Login failed";
        if (typeof response.text === "function") {
          const txt = await response.text();
          errMsg = extractErrorMessage(txt);
        } else if (typeof response.json === "function") {
          const data = await response.json();
          errMsg = data.error || errMsg;
        }
        throw new Error(errMsg);
      }

      const profileResponse = await fetch("/api/user", {
        credentials: "include",
      });
      if (!profileResponse.ok) {
        throw new Error("User profile could not be loaded.");
      }
      
      const userData = await profileResponse.json();
      setUser(userData);
      localStorage.setItem("userData", JSON.stringify(userData));
    } catch (err: any) {
      const msg = err.message || "Error during login";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, studyType: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, studyType }),
        credentials: "include",
      });

      if (!response.ok) {
        let errMsg = "Registration failed";
        if (typeof response.text === "function") {
          const txt = await response.text();
          errMsg = extractErrorMessage(txt);
        } else if (typeof response.json === "function") {
          const data = await response.json();
          errMsg = data.error || errMsg;
        }
        throw new Error(errMsg);
      }
    } catch (err: any) {
      const msg = err.message || "Error during registration";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("userData");
    } catch (err: any) {
      setError(err.message || "Logout failed");
      throw err;
    } finally {
      setUser(null);
      setError(null);
      setLoading(false);
    }
  }, []);

  const loadUser = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user", {
        credentials: "include",
      });
      if (!res.ok) {
        let errMsg = "Failed to load user";
        if (typeof res.text === "function") {
          const txt = await res.text();
          errMsg = extractErrorMessage(txt) || errMsg;
        } else if (typeof res.json === "function") {
          const data = await res.json();
          errMsg = data.error || errMsg;
        }
        throw new Error(errMsg);
      }
      const userData = await res.json();
      setUser(userData);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error loading user";
      setError(msg);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const setErrorVal = useCallback((val: string | null) => setError(val), []);
  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    let mounted = true;
    async function checkAuth() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/user", {
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          if (mounted) setUser(userData);
        } else {
          if (mounted) setUser(null);
        }
      } catch (err) {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    checkAuth();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user,
        user,
        loading,
        error,
        setError: setErrorVal,
        login,
        logout,
        register,
        clearError,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
