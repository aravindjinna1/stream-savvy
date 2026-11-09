// src/components/Navbar.jsx
import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ThemeContext from "../context/ThemeContext";
import "./Navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { auth, logoutUser } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

  const isAuthed = !!auth?.isAuthenticated;

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    logoutUser?.();
    closeMenu();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="ss-nav-wrapper">

      <Link to="/" className="ss-logo">
        <span className="ss-logo-name">
          Stream<span>Savvy</span>
        </span>
      </Link>

      <nav aria-label="Main navigation" className="ss-menu">

        

       



        {/* Burger Button */}
        <button
          className={`ss-button ${open ? "ss-button--active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="ss-bar" />
          <span className="ss-bar" />
          <span className="ss-bar" />
        </button>

        {/* Menu */}
        <ul className={`ss-menu-list ${open ? "ss-menu-list--active" : ""}`}>
          <li>
            <Link
              to="/"
              className={`ss-menu-link-pill ${
                isActive("/") ? "active" : ""
              }`}
              onClick={closeMenu}
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/movies"
              className={`ss-menu-link-pill ${
                isActive("/movies") ? "active" : ""
              }`}
              onClick={closeMenu}
            >
              Movies
            </Link>
          </li>

          <li>
            <Link
              to="/profile"
              className={`ss-menu-link-pill ${
                isActive("/profile") ? "active" : ""
              }`}
              onClick={closeMenu}
            >
              Profile
            </Link>
          </li>

          <li>
            {/* <Link
              to="/about"
              className={`ss-menu-link-pill ${
                isActive("/about") ? "active" : ""
              }`}
              onClick={closeMenu}
            >
              About
            </Link> */}
          </li>

          {/* Auth Button */}

          
        <button
          className="ss-theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" />
            </svg>
          )}
          {/* <span>{theme === "dark" ? "Light" : "Dark"}</span> */}
        </button>
        
         <li>
  {isAuthed ? (
    <Link
      className="ss-menu-link-pill danger"
      onClick={handleLogout}
      aria-label="Logout"
      title="Logout"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    </Link>
  
            ) : (
              <Link
                to="/login"
                className={`ss-menu-link-pill ${
                  isActive("/login") ? "active" : ""
                }`}
                onClick={closeMenu}
              >
                Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
