import { createContext, useState, useMemo, useCallback, useEffect } from "react";
import { useTheme } from './hooks/useTheme.js';

const Ctx = createContext(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const toggle = useCallback(() => setTheme(t => (t === "light" ? "dark" : "light")), []);
  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);
  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export {Ctx, ThemeProvider};