"use client";

import { useContext } from "react";
import { MenuContext } from "@/context/MenuContext";


// Page Overlay component
// Visible if menuOpen is true OR modalOpen is not null
// Clicking the overlay sets menuOpen to false and modalOpen to null
// Closes the drawer and any open modal when clicking outside
// function PageOverlay({onClick }: PageOverlayProps) {
//     if (menuOpen || modalOpen !== null) {
//     return <div className="page-overlay" onClick={onClick}></div>;
//   }
// }

export default function PageOverlay() {
    const { menuOpen, modalOpen, toggleMenu } = useContext(MenuContext);

    if (menuOpen || modalOpen !== null) {
        return <div className="page-overlay" onClick={() => toggleMenu(false, null)}></div>;
    }
};