import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import ProtectedRoute from "./ProtectedRoute"; // default export
import Home from "../pages/Home/Home";
import Movimientos from "../pages/Movimientos/Movimientos";
import Nuevo from "../pages/Nuevo/Nuevo";
import Login from "../pages/Login/Login";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // única ruta pública
      { path: "login", element: <Login /> },

      // todo lo demás protegido
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <Home /> },     // "/" → Home protegido
          { path: "home", element: <Home /> },    // "/home" protegido
          { path: "movimientos", element: <Movimientos /> },
          { path: "nuevo", element: <Nuevo /> },
        ],
      },

      // 404 → redirige a raíz (que cae en ProtectedRoute o login)
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
