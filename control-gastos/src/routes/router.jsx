import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home/Home";
import Movimientos from "../pages/Movimientos/Movimientos";
import Nuevo from "../pages/Nuevo/Nuevo";

export const router = createBrowserRouter([
  {path: '/', element: <App/>, children: [
    { index: true, element: <Home/>},
    { path: 'movimientos', element: <Movimientos/>},
    { path: 'nuevo', element: <Nuevo/>},
  ]},
])