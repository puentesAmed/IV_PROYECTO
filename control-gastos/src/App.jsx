import './styles/App.css';
import { Outlet } from 'react-router-dom';
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
