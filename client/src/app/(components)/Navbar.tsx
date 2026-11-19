"use client";
import { IconButtonProps } from "../lib/definitions";

import { useContext } from "react";
import { MenuContext } from "@/context/MenuContext";
import { FilterContext } from "@/context/FilterContext";

//Passing onMenuClick as a prop
export default function Navbar() {
  const { menuOpen, toggleMenu } = useContext(MenuContext);
  const { filters, updateFilters } = useContext(FilterContext);

  return (
    <nav>
      <div className="nav-logo">
        <img className="nav-icon" src="icons/logo.svg" />
        <p>Public Safety Alerts Aggregator</p>
      </div>
      <div className="nav-controls">
        <input
          className="search-input"
          type="text"
          placeholder="Search alerts"
          value={filters.search ?? ""}
          onChange={(e) =>
            updateFilters({ ...filters, search: e.target.value || null })
          }
        />
        <IconButton
          onClick={() => toggleMenu(!menuOpen, null)}
          icon="icons/hamburger-menu.svg"
          alt="Open menu"
        />
        <IconButton
          onClick={() => toggleMenu(menuOpen, "subscribe")}
          icon="icons/bell.svg"
          alt="Open alert preferences"
        />
      </div>
    </nav>
  );
}

//Note: Button/drawer would normally be in separate files but they are only used once in this project

//Button component(s)
function IconButton({ onClick, icon, alt }: IconButtonProps) {
  return (
    <button onClick={onClick}>
      <img className="nav-icon" src={icon} alt={alt} />
    </button>
  );
}
