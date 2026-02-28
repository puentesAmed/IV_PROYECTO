import { createContext, useContext } from "react";

export const NotificationContext = createContext(null);

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification debe usarse dentro de <NotificationProvider>");
  return ctx;
}
