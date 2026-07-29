"use client";
import SubscribeModal from "./components/SubscribeModal";
import Footer from "./components/Footer";
import AlertList from "./components/AlertList";
import Navbar from "./components/Navbar";
import MenuDrawer from "./components/Drawer";
import FilterTabs from "./components/FilterTabs";
import { useState } from "react";
import GoogleMap from "./components/Map";

export default function Home() {
  //These state variables must be accessible by the Navbar, MenuDrawer, and AlertMenuModal
  const [menuOpen, setMenuOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);

  // Event handlers are defined below / both are passed to Navbar as props
  // handleMenuClick() reverses the state of menuOpen when the hamburger icon is clicked
  function handleMenuClick() {
    setMenuOpen(!menuOpen);
  }

  //handleAlertMenuClick() reverses the state of alertsOpen when the bell icon is clicked
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
      <MenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <main>
        <AlertList />
        <div className="map-area">
          <FilterTabs />
          <GoogleMap />
        </div>
      </main>
      <Footer />
      <SubscribeModal
        isOpen={alertsOpen}
        onClose={() => setAlertsOpen(false)}
      />
    </>
  );
}

// Page Overlay component
// Is only visible if menuOpen OR alertsOpen (state variables) is true
// On click the overlay sets BOTH menuOpen AND alertsOpen to false,
// Closes menuDrawer and AlertMenuModal by clicking anywhere outside
// Visibility of menuDrawer and AlertMenuModal are controlled with CSS classes and ternary operators (see component files)
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
