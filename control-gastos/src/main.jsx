import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router.jsx";
import { MovimientosProvider } from "./context/MovimientosContext.jsx";
import { ThemeProvider } from "./context/ThemeProvider.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { NotificationProvider } from "./context/NotificationProvider.jsx";

import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <MovimientosProvider>
          <NotificationProvider>
            <RouterProvider router={router} />
          </NotificationProvider>
        </MovimientosProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
