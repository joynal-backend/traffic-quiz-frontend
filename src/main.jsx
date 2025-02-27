import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import AuthProvider from "./Context/AuthContext";
import App from "./App";
import { routes } from "./routes/routes.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      {/* Wrap the RouterProvider around the App component */}
      <RouterProvider router={routes}>
        <App />
      </RouterProvider>
    </AuthProvider>
  </StrictMode>
);