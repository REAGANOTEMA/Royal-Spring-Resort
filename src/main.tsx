"use client";

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // Main App component
import "./globals.css"; // Tailwind global styles
import { supabase } from "./lib/supabaseClient"; // Supabase client

// Ensure environment variables exist
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Supabase environment variables are missing!");
}

// Root container
const container = document.getElementById("root");
if (!container) throw new Error("Root element with id 'root' not found");

// Create React root
const root = createRoot(container);

// Optional: Simple Error Boundary
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setErrorMsg(event.message);
      console.error(event.error);
    };
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <div className="p-10 text-red-700 font-bold">
        Something went wrong: {errorMsg}
      </div>
    );
  }

  return <>{children}</>;
};

// Render App
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);