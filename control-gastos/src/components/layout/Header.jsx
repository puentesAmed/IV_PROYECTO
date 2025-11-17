import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import Logo from "../common/Logo/Logo";
import light from "../../assets/light-mode-iconSol.png";
import dark from "../../assets/dark-mode-iconluna.png";
import { useAuth } from "../../hooks/useAuth";

export function Header() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const isDark = theme === "dark";

  return (
    <header className="header" role="banner">
      <div className="header__inner">
        <Link to="/" className="logo" aria-label="Inicio">
          <Logo />
        </Link>

        <nav className="nav" aria-label="Navegación principal">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Inicio
          </NavLink>

          {user && (
            <NavLink
              to="/movimientos"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Movimientos
            </NavLink>
          )}

          {user && (
            <NavLink
              to="/nuevo"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Nuevo
            </NavLink>
          )}

          {!user && (
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Login
            </NavLink>
          )}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user && (
            <span className="muted" title={user.email}>
              Hola, {user.name}
            </span>
          )}

          {user && (
            <button className="btn btn--outline" onClick={logout}>
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

