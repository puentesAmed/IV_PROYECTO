import { createBrowserRouter, Navigate } from "react-router-dom";
import { App } from "../App";
import { ProtectedRoute } from "./ProtectedRoute";
import { Home } from "../pages/Home/Home";
import { Movimientos } from "../pages/Movimientos/Movimientos";
import { Nuevo } from "../pages/Nuevo/Nuevo";
import { Login } from "../pages/Login/Login";
import { Register } from "../pages/Register/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <Home /> },
          { path: "home", element: <Home /> },
          { path: "movimientos", element: <Movimientos /> },
          { path: "nuevo", element: <Nuevo /> },
        ],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
