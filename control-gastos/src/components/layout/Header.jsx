import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import Logo from "../common/Logo/Logo";
import light from "../../assets/light-mode-iconSol.png";
import dark from "../../assets/dark-mode-iconluna.png";

export function Header() {
  const { theme, toggle } = useContext(ThemeContext);
  const { user, logout } = useAuth();
  const { notify } = useNotification();
  const isDark = theme === "dark";

  const handleLogout = () => {
    logout();
    notify("Sesión cerrada", "info");
  };

  return (
    <header className="header" role="banner">
      <div className="header__inner">
        <Link to="/" className="logo" aria-label="Inicio">
          <Logo />
        </Link>

        <nav className="nav" aria-label="Navegación principal">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : undefined)}>
            Inicio
          </NavLink>

          {user && (
            <NavLink to="/movimientos" className={({ isActive }) => (isActive ? "active" : undefined)}>
              Movimientos
            </NavLink>
          )}

          {user && (
            <NavLink to="/nuevo" className={({ isActive }) => (isActive ? "active" : undefined)}>
              Nuevo
            </NavLink>
          )}

          {!user && (
            <>
              <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : undefined)}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : undefined)}>
                Registro
              </NavLink>
            </>
          )}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user && <span className="muted" title={user.email}>Hola, {user.name}</span>}
          {user && (
            <button className="btn btn--outline" onClick={handleLogout}>
              Salir
            </button>
          )}

          <button
            className="theme-button"
            onClick={toggle}
            aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
            aria-pressed={isDark}
            title={isDark ? "Tema oscuro activado" : "Tema claro activado"}
          >
            <img src={isDark ? dark : light} alt="" />
          </button>
        </div>
      </div>
    </header>
  );
}
