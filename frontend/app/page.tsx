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
      <AlertMenuModal alertsMenuOpen={alertsOpen} />
    </>
  );
}
