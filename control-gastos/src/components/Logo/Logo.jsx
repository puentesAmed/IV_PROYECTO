import React from 'react';
import './Logo.css';

const Logo = () => (
  <div className="logo-wrapper">
    <div className="logo-img-container">
      <img src="/circulo_logo (1).png" alt="Logo Gastos Fácil" className="logo-image" />
    </div>

    <div className="logo-text">
      <span className="gastos">Gastos </span>
      <span className="facil">Fácil</span>
    </div>
  </div>
);

export default Logo;