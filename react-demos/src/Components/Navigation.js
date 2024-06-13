import React, { useState } from 'react';
import { NavLink } from'react-router-dom';
import logo from '../logo.svg';

function NavigationBar() {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} className="App-logo" alt="logo" />
      </div>
      <ul className="nav-links">
        <li><NavLink exact to="/" activeClassName="active">Home</NavLink></li>
        <li><NavLink to="/productportfolio" activeClassName="active">Example Product Portfolio</NavLink></li>
        <li><NavLink to="/spacegame" activeClassName="active">Example Arcade Game</NavLink></li>
        <li className="dropdown" onClick={toggleMenu}>
          <a href="#">About &#9662;</a>
          {showMenu && (
            <ul className="dropdown-menu">
              <li><a href="#">Company</a></li>
              <li><a href="#">Team</a></li>
              <li className="dropdown-level-2" onClick={(e) => e.stopPropagation()}>
                <a href="#">Contact &#9662;</a>
                <ul className="dropdown-menu-level-2">
                  <li><a href="#">Via email</a></li>
                  <li><a href="#">Via telephone</a></li>
                </ul>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default NavigationBar;