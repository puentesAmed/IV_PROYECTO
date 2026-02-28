import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";

const SESSION_USER_KEY = "session_auth_user";
const SESSION_USERS_KEY = "session_auth_users";

function readUsers() {
  try {
    const raw = sessionStorage.getItem(SESSION_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(SESSION_USER_KEY);
    }
  }, [user]);

  const register = useCallback(async ({ name, email, password }) => {
    const users = readUsers();
    if (users.some((u) => u.email === email)) {
      throw new Error("Ya existe una cuenta con ese email");
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
    };

    sessionStorage.setItem(SESSION_USERS_KEY, JSON.stringify([...users, newUser]));
    return { id: newUser.id, name: newUser.name, email: newUser.email };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const users = readUsers();
    const account = users.find((u) => u.email === email && u.password === password);

    if (!account) {
      throw new Error("Credenciales inválidas");
    }

    const sessionUser = {
      id: account.id,
      name: account.name,
      email: account.email,
    };

    setUser(sessionUser);
    return sessionUser;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({ user, login, logout, register }),
    [user, login, logout, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
