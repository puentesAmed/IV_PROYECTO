import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";

const STORAGE_KEY = "auth_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* almacenamiento no disponible */
    }
  }, [user]);

  const login = useCallback(async ({ email, password }) => {
    if (!email || !password || password.length < 4) {
      throw new Error("Credenciales inválidas");
    }

    const authenticatedUser = {
      id: "u1",
      name: email.split("@")[0],
      email,
    };

    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
