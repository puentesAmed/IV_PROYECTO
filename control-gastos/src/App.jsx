/*import { Outlet } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';


function App() {
  
  return (
    <>
      <div className="app">
        <Header />
        <main className="container">
        <Outlet />        
        </main>
        <Footer />
      </div>     
    </>
  );
}

export default App
*/

import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.getElementById("main-content")?.focus();
  }, [pathname]);

  return (
    <div className="app">
      <Header />
      <main id="main-content" tabIndex={-1} className="container" role="main">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
export default App;
