/*import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import App from "../App";

const Home = lazy(() => import("../pages/Home/Home"));
const Movimientos = lazy(() => import("../pages/Movimientos/Movimientos"));
const Nuevo = lazy(() => import("../pages/Nuevo/Nuevo"));

const withSuspense = (el) => (
  <Suspense>
    {el}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: withSuspense( "Ha ocurrido un problema." ),
    children: [
      { index: true, element: withSuspense(<Home />) },
      { path: "movimientos", element: withSuspense(<Movimientos />) },
      { path: "nuevo", element: withSuspense(<Nuevo />) },      
    ],
  },
]);
*/
/*
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import App from "../App";
import { ProtectedRoute } from "./ProtectedRoute";

const Home = lazy(() => import("../pages/Home/Home"));
const Movimientos = lazy(() => import("../pages/Movimientos/Movimientos"));
const Nuevo = lazy(() => import("../pages/Nuevo/Nuevo"));
const Login = lazy(() => import("../pages/Login/Login"));

const withSuspense = (el) => (
  <Suspense fallback={<div role="status" style={{ padding: 16 }}>Cargando…</div>}>{el}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: withSuspense(<Home />) },
      { path: "login", element: withSuspense(<Login />) },
      {
        element: <ProtectedRoute />,          
        children: [
          { path: "home", element: withSuspense(<Home />) },
          { path: "movimientos", element: withSuspense(<Movimientos />) },
          { path: "nuevo", element: withSuspense(<Nuevo />) },
        ],
      },
      { path: "*", element: withSuspense(<div style={{padding:24}}>404</div>) },
    ],
  },
]);
*/

// src/routes/router.jsx
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
