import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth-context";
const KEY = "auth_user";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem(KEY, JSON.stringify(user));
    else localStorage.removeItem(KEY);
  }, [user]);

  const API = import.meta.env.VITE_API_URL ?? "http://localhost:5179";

  const login = useCallback(async ({ email, password }) => {
    const qs = new URLSearchParams({ email, password }).toString();
    const res = await fetch(`${API}/users?${qs}`);
    if (!res.ok) throw new Error("Error de red");
    const arr = await res.json();
    if (!Array.isArray(arr) || arr.length === 0) throw new Error("Credenciales inválidas");
    const { id, name } = arr[0];
    setUser({ id, name, email });
  }, []);

  const logout = useCallback(() => setUser(null), []);
  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
