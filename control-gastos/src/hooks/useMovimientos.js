import { useContext } from "react";
import { MovimientosContext } from "../context/MovimientosContext";

export function useMovimientos() {
  const ctx = useContext(MovimientosContext);
  if (!ctx) throw new Error("useMovimientos debe usarse dentro de <MovimientosProvider>");
  return ctx;
}
