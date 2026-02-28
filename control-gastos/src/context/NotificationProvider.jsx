import { useCallback, useMemo, useState } from "react";
import { NotificationContext } from "./NotificationContext";

let inc = 0;

export function NotificationProvider({ children }) {
  const [items, setItems] = useState([]);

  const notify = useCallback((message, type = "info") => {
    const id = ++inc;
    setItems((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {items.map((item) => (
          <div key={item.id} className={`toast toast--${item.type}`} role="status">
            <span>{item.message}</span>
            <button type="button" className="toast__close" onClick={() => remove(item.id)} aria-label="Cerrar notificación">
              ×
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
