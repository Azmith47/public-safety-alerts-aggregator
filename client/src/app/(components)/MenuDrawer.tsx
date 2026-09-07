"use client";

import { MenuContext } from "../../context/MenuContext";
import { useContext } from "react";

export default function MenuDrawer() {
  const { menuOpen, toggleMenu } = useContext(MenuContext);

  const onClose = () => toggleMenu(false, null);
  const onFilterClick = () => toggleMenu(false, "filter");
  const onMySearchesClick = () => toggleMenu(false, "searches");
  const onMyAlertsClick = () => toggleMenu(false, "myAlerts");

  return (
    <div className={menuOpen ? "drawer-visible" : "drawer-hidden"}>
      <div className="drawer-header">
        <button onClick={onClose}>✕</button>
      </div>
      <ul>
        <li>
          <button className="drawer-menu-button" onClick={onFilterClick}>
            Filter
          </button>
        </li>
        <li>
          <button className="drawer-menu-button" onClick={onMySearchesClick}>
            My Searches
          </button>
        </li>
        <li>
          <button className="drawer-menu-button" onClick={onMyAlertsClick}>
            My Alerts
          </button>
        </li>
      </ul>
    </div>
  );
}
