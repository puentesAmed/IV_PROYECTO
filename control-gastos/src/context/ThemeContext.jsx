import { createContext, useState, useMemo } from "react";

const Ctx = createContext(null);

function ThemeProvider ({children}){
    const [theme, setTheme] = useState('light');
    const value = useMemo(() => ({theme, toggle: () => setTheme(theme === 'light' ? 'dark' : 'light')}), [theme]);
    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}



export {Ctx, ThemeProvider};