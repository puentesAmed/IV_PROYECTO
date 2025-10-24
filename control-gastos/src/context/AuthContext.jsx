import { createContext, useCallback, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext(null);
const KEY = "auth_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem(KEY, JSON.stringify(user));
    else localStorage.removeItem(KEY);
  }, [user]);

  const login = useCallback(async ({ email, password }) => {
    // Mock: valida contra json-server (opcional) o credenciales fijas
    // Ejemplo simple: cualquier pass con longitud >= 4
    if (!email || !password || password.length < 4) throw new Error("Credenciales inválidas");
    setUser({ id: "u1", name: email.split("@")[0], email });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
