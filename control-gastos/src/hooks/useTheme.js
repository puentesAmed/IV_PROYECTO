import { useContext } from "react";
import { Ctx } from "./ThemeContext";

export const useTheme = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
};