import { Link, NavLink } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import { useTheme } from '../../hooks/useTheme';


export default function Header(){
    const { theme, toggle } = useTheme();
    return (
        <header className="header">
            <div className="container header__inner">
                <Link to="/" className="logo">Gastos Fácil</Link>
                <nav className="nav">
                    <NavLink to="/" end>Inicio</NavLink>
                    <NavLink to="/movimientos">Movimientos</NavLink>
                    <NavLink to="/nuevo">Nuevo</NavLink>
                </nav>
                <button onClick={toggle} aria-label="Cambiar tema">{theme==='light'?'🌞':'🌙'}</button>
            </div>
        </header>
    );
}