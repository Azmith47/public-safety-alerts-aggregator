"use client";
import AlertMenuModal from "./components/AlertMenuModal";
import Footer from "./components/Footer";
import AlertList from "./components/AlertList";
import Navbar from "./components/Navbar";
import MenuDrawer from "./components/Drawer";
import FilterArea from "./components/FilterArea";
import { useState } from "react";
import GoogleMap from "./components/Map";

export default function Home() {
  //useState for navbar-menu-button
  const [menuOpen, setMenuOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);

  //   Event handlers
  function handleMenuClick() {
    setMenuOpen(!menuOpen);
  }

  function handleAlertMenuClick() {
    setAlertsOpen(!alertsOpen);
  }

  return (
    <>
      <PageOverlay
        menuOpen={menuOpen}
        alertsOpen={alertsOpen}
        onClick={() => {
          setMenuOpen(false);
          setAlertsOpen(false);
        }}
      />
      <Navbar
        onMenuClick={handleMenuClick}
        onAlertsClick={handleAlertMenuClick}
      />
      {/*Arrow function => only runs on click NOT on render*/}
      <MenuDrawer menuOpen={menuOpen} menuClose={() => setMenuOpen(false)} />
      <main>
        <AlertList />
        <div className="map-area">
          <FilterArea />
          <GoogleMap />
        </div>
      </main>
      <Footer />
      <AlertMenuModal
        alertsMenuOpen={alertsOpen}
        menuClose={() => setAlertsOpen(false)}
      />
    </>
  );
}

// Page overlay component - closes menuDrawer and modal by clicking anywhere outside
function PageOverlay({
  menuOpen,
  alertsOpen,
  onClick,
}: {
  menuOpen: boolean;
  alertsOpen: boolean;
  onClick: () => void;
}) {
  if (menuOpen === true || alertsOpen === true) {
    return <div className="page-overlay" onClick={onClick}></div>;
  }
}
