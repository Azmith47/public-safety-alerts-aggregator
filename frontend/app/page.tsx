"use client";
import { useState } from "react";
import SubscribeModal from "./components/SubscribeModal";
import Footer from "./components/Footer";
import AlertList from "./components/AlertList";
import Navbar from "./components/Navbar";
import MenuDrawer from "./components/MenuDrawer";
import FilterTabs from "./components/FilterTabs";
import GoogleMap from "./components/Map";
import FilterModal from "./components/FilterModal";
import MySearchesModal from "./components/MySearchesModal";
import MyAlertsModal from "./components/MyAlertsModal";

export default function Home() {
  //State variables
  const [menuOpen, setMenuOpen] = useState(false); //belongs menu (opened via hamburger icon)
  const [modalOpen, setModalOpen] = useState<string | null>(null); //modalOpen can be null or a string

  return (
    <>
      <PageOverlay
        menuOpen={menuOpen}
        modalOpen={modalOpen}
        onClick={() => {
          setMenuOpen(false);
          setModalOpen(null);
        }}
      />
      <Navbar
        onMenuClick={() => setMenuOpen(!menuOpen)}
        onSubscribeClick={() => setModalOpen("subscribe")}
      />
      <MenuDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onFilterClick={() => setModalOpen("filter")}
        onMySearchesClick={() => setModalOpen("searches")}
        onMyAlertsClick={() => setModalOpen("myAlerts")}
      />
      <main>
        <AlertList />
        <div className="map-area">
          <FilterTabs />
          <GoogleMap />
        </div>
      </main>
      <Footer />
      {/* if modalOpen === "subscribe" then isOpen={true}, which changes the ternary inside the component to apply the modal-container-visible CSS class. The same idea applies to the other modals */}
      <SubscribeModal
        isOpen={modalOpen === "subscribe"}
        onClose={() => setModalOpen(null)}
      />
      <FilterModal
        isOpen={modalOpen === "filter"}
        onClose={() => setModalOpen(null)}
      />
      <MySearchesModal
        isOpen={modalOpen === "searches"}
        onClose={() => setModalOpen(null)}
      />
      <MyAlertsModal
        isOpen={modalOpen === "myAlerts"}
        onClose={() => setModalOpen(null)}
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
  modalOpen,
  onClick,
}: {
  menuOpen: boolean;
  modalOpen: string | null;
  onClick: () => void;
}) {
  if (menuOpen || modalOpen !== null) {
    return <div className="page-overlay" onClick={onClick}></div>;
  }
}
