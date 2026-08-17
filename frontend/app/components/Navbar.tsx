"use client";
import { NavbarProps } from "../lib/definitions";
import { IconButtonProps } from "../lib/definitions";

//Button component(s)
function IconButton({ onClick, icon, alt }: IconButtonProps) {
  return (
    <button onClick={onClick}>
      <img className="nav-icon" src={icon} alt={alt} />
    </button>
  );
}

//Passing onMenuClick as a prop
export default function Navbar({ onMenuClick, onSubscribeClick }: NavbarProps) {
  return (
    <nav>
      <div className="nav-logo">
        <img className="nav-icon" src="icons/logo.svg" />
        <p>Critical Signal</p>
      </div>
      <div className="nav-controls">
        <input
          className="search-input"
          type="text"
          placeholder="Search alerts"
        />
        <IconButton
          onClick={onMenuClick}
          icon="icons/hamburger-menu.svg"
          alt="Open menu"
        />
        <IconButton
          onClick={onSubscribeClick}
          icon="icons/bell.svg"
          alt="Open alert preferences"
        />
      </div>
    </nav>
  );
}
