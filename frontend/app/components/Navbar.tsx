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
        <span className="nav-logo-icon">👽</span>
        <p>Critical Signal</p>
      </div>
      <div className="nav-controls">
        <input type="text" placeholder="Search alerts" />
        <IconButton onClick={onMenuClick} icon="☰" />
        <IconButton onClick={onAlertsClick} icon="Alerts" />
      </div>
    </nav>
  );
}

//Note: Button/drawer would normally be in separate files but they are only used once in this project

//Button component(s)
function IconButton({ onClick, icon }: { onClick: () => void; icon: string }) {
  return <button onClick={onClick}>{icon}</button>;
}

//Drawer component
export function MenuDrawer({ menuOpen }: { menuOpen: boolean }) {
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
