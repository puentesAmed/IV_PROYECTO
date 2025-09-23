import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import Logo from '../Logo/Logo';
import light from '../../assets/light-mode-iconSol.png';
import dark from '../../assets/dark-mode-iconluna.png';


export default function Header(){
    const { theme, toggle } = useTheme();
    return (
        <header className="header">
            <div className="container">
                <Link to="/" className="logo">                
                    <Logo />
                </Link>
                <nav className="nav">
                    <NavLink to="/" end>Inicio</NavLink>
                    <NavLink to="/movimientos">Movimientos</NavLink>
                    <NavLink to="/nuevo">Nuevo</NavLink>
                </nav>
                <button className='theme-button' onClick={toggle} aria-label="Cambiar tema">
                    {theme === 'light' 
                        ? <img src={light} alt="Modo claro" /> 
                        : <img src={dark} alt="Modo oscuro" />}
                </button>

            </div>
        </header>
    );
}