import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { AuthProvider, useAuth } from "./JWTAuthContext";

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

vi.stubGlobal("localStorage", localStorageMock);

describe("JWTAuthContext - Authentication Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
      "fetch",
      vi.fn((url) => {
        if (url === "/api/user") {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: 1, name: "Test User", email: "test@flow.com" }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("checkAuth fetches user profile on mount", async () => {
    function DummyComponent() {
      const { user, loading } = useAuth();
      if (loading) return <div>Loading...</div>;
      return <div>User: {user?.name}</div>;
    }

    render(
      <AuthProvider>
        <DummyComponent />
      </AuthProvider>
    );

    expect(screen.getByText("Loading...")).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText("User: Test User")).toBeDefined();
    });
  });

  it("login() makes a POST request to /api/login and updates user", async () => {
    let userFetched = false;
    vi.stubGlobal(
      "fetch",
      vi.fn((url) => {
        if (url === "/api/login") {
          return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) });
        }
        if (url === "/api/user") {
          userFetched = true;
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: 42, name: "Alex", email: "alex@flow.com" }),
          });
        }
        return Promise.resolve({ ok: false });
      })
    );

    function LoginComponent() {
      const { login, user } = useAuth();
      return (
        <div>
          <button onClick={() => login("alex@flow.com", "pass123")}>Login</button>
          {user && <span data-testid="user-profile">{user.name}</span>}
        </div>
      );
    }

    render(
      <AuthProvider>
        <LoginComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/login",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "alex@flow.com", password: "pass123" }),
        })
      );
      expect(userFetched).toBe(true);
      expect(screen.getByTestId("user-profile").textContent).toBe("Alex");
    });
  });

  it("register() makes a POST request to /api/register with studyType", async () => {
    function RegisterComponent() {
      const { register } = useAuth();
      return (
        <button onClick={() => register("Alex", "alex@flow.com", "pass123", "sprinter")}>
          Register
        </button>
      );
    }

    render(
      <AuthProvider>
        <RegisterComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/register",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "Alex", email: "alex@flow.com", password: "pass123", studyType: "sprinter" }),
        })
      );
    });
  });

  it("logout() makes a POST request to /api/logout and clears user profile", async () => {
    function LogoutComponent() {
      const { logout, user } = useAuth();
      return (
        <div>
          <button onClick={() => logout()}>Logout</button>
          <span data-testid="user-status">{user ? "Logged In" : "Logged Out"}</span>
        </div>
      );
    }

    render(
      <AuthProvider>
        <LogoutComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /logout/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/logout",
        expect.objectContaining({
          method: "POST",
        })
      );
      expect(screen.getByTestId("user-status").textContent).toBe("Logged Out");
    });
  });

  it("login() sets error state when credentials validation fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url) => {
        if (url === "/api/user") {
          return Promise.resolve({ ok: false });
        }
        return Promise.resolve({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ error: "Invalid credentials." }),
        });
      })
    );

    function LoginComponentWithError() {
      const { login, error } = useAuth();
      return (
        <div>
          <button onClick={() => login("wrong@flow.com", "wrong").catch(() => {})}>Login</button>
          {error && <span data-testid="error-msg">{error}</span>}
        </div>
      );
    }

    render(
      <AuthProvider>
        <LoginComponentWithError />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByTestId("error-msg").textContent).toBe("Invalid credentials.");
    });
  });
});
