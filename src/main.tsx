// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client"; // Use createRoot for React 18+
import App from "./App"; // Ensure this points to your main app file
import "./globals.css"; // Global styles including Tailwind

// Ensure the root element exists and render the app
const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);