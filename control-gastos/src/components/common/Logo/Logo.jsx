import React from 'react';
import './Logo.css';
import logo from '../../../assets/circulo_logo (1).png'

const Logo = () => (
  <div className="logo-wrapper">
    <div className="logo-img-container">
      <img src={logo} alt="Logo Gastos Fácil" className="logo-image" />
    </div>

    <div className="logo-text">
      <span className="gastos">Gastos </span>
      <span className="facil">Fácil</span>
    </div>
  </div>
);

export default Logo;