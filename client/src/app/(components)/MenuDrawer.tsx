"use client";

import { MenuContext } from "../../context/MenuContext";
import { useContext } from "react";

export default function MenuDrawer() {
  const { menuOpen, toggleMenu } = useContext(MenuContext);
  
  const onClose= () => toggleMenu(false, null)
  const onFilterClick=() => toggleMenu(false, "filter")
  const onMySearchesClick=() => toggleMenu(false, "searches")
  const onMyAlertsClick=() => toggleMenu(false, "myAlerts")

  return (
    //Visibility of the modal is determined by a ternary that swaps the CSS class
    //The drawer is hidden unless isOpen is true
    <div className={menuOpen ? "drawer-visible" : "drawer-hidden"}>
      <div className="drawer-header">
        {/* Sets isOpen to false, changing the CSS class to drawer-hidden */}
        <button onClick={onClose}>✕</button>
      </div>
      <ul>
        <li>
          {/* The onClick functions are defined in page.tsx. Each onClick uses the setModalOpen function to change the value of modalOpen to the corresponding modal, for example clicking Filter changes the value of modalOpen to 'filter', which evaluates to isOpen={true}. This changes the CSS class of the modal to modal-container-visible via the ternary statement   */}
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
