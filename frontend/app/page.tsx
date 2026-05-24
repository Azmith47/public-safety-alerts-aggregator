"use client";
import Modal from "./components/Modal";
import Footer from "./components/Footer";
import AlertList from "./components/AlertList";
import Navbar from "./components/Navbar";
import MenuDrawer from "./components/Drawer";
import FilterArea from "./components/FilterArea";
import { useState } from "react";

export default function Home() {
  //useState for navbar-menu-button
  const [menuOpen, setMenuOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  //Modal
  const [alertsModalOpen, setAlertsModalOpen] = useState(false);

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
      <MenuDrawer menuOpen={menuOpen} />
      <main>
        <AlertList />
        <div className="map-area">
          <FilterArea />
        </div>
      </main>
      <Footer />
      <Modal alertsMenuOpen={alertsOpen} />
    </>
  );
}
