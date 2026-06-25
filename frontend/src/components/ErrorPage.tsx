import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error("Route error caught by ErrorBoundary:", error);

  let statusCode = 500;
  let statusText = "Server Error";
  let message = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    statusText = error.statusText;
    if (error.status === 404) {
      message = "This page could not be found.";
    } else if (error.status === 401) {
      message = "No permission to access this page. Please log in.";
    } else if (error.status === 403) {
      message = "Access to this resource is forbidden.";
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, var(--paper, #f4f8ff) 0%, var(--blue-pale, #e8f2ff) 100%)",
      padding: "2rem",
      boxSizing: "border-box",
      fontFamily: "var(--font-mono)"
    }}>
      <div style={{
        backgroundColor: "var(--white, #ffffff)",
        border: "var(--border-subtle, 1px solid rgba(0,0,0,0.06))",
        borderRadius: "var(--radius-md, 12px)",
        padding: "3rem 2.5rem",
        maxWidth: "600px",
        width: "100%",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(74, 143, 212, 0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem"
      }}>

        <h1 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "3.5rem",
          fontWeight: 500,
          margin: 0,
          color: "var(--ink, #1a1f2e)"
        }}>
          {statusCode}
        </h1>

        <h2 style={{
          fontSize: "0.8rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--blue-dark, #4a8fd4)",
          margin: 0,
          paddingBottom: "0.5rem",
          borderBottom: "1px solid var(--blue-pale, #e8f2ff)",
          display: "inline-block"
        }}>
          {statusText}
        </h2>

        <p style={{
          fontSize: "0.95rem",
          color: "var(--ink-soft, #3d4559)",
          margin: "1rem 0",
          lineHeight: "1.6"
        }}>
          {message}
        </p>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginTop: "1.5rem"
        }}>
          <Link to="/home" style={{ textDecoration: "none" }}>
            <button type="button" className="button" style={{ padding: "0.75rem 2rem", fontSize: "0.9rem" }}>
              Go to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
