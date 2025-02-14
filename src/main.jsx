import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/routes";
import AuthProvider from "./context/AuthContext"; // ✅ Import AuthProvider
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider> {/* ✅ Wrap the entire app */}
      <RouterProvider router={routes} />
    </AuthProvider>
  </StrictMode>
);
