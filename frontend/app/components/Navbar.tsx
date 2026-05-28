"use client";
import { useState } from "react";

//Passing onMenuClick as a prop
export default function Navbar({
  onMenuClick,
  onAlertsClick,
}: {
  onMenuClick: () => void;
  onAlertsClick: () => void;
}) {
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
          onClick={onAlertsClick}
          icon="icons/bell.svg"
          alt="Open alert preferences"
        />
      </div>
    </nav>
  );
}

//Note: Button/drawer would normally be in separate files but they are only used once in this project

//Button component(s)
function IconButton({
  onClick,
  icon,
  alt,
}: {
  onClick: () => void;
  icon: string;
  alt: string;
}) {
  return (
    <button onClick={onClick}>
      <img className="nav-icon" src={icon} alt={alt} />
    </button>
  );
}

//Drawer component
export function MenuDrawer({
  menuOpen,
  onClick,
}: {
  menuOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className={menuOpen ? "drawer-visible" : "drawer-hidden"}>
      <div className="drawer-header">
        <button>✕</button>
      </div>
      <ul>
        <li>Filter</li>
        <li>My Searches</li>
        <li>My Alerts</li>
      </ul>
    </div>
  );
}
