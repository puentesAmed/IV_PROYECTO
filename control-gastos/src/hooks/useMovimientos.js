import { useContext } from "react";
import { Ctx } from "./MovimientosProvider";

export const useMovimientos = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMovimientos must be used within MovimientosProvider");
  return ctx;
};
