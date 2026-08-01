"use client";
import { useState } from "react";
import Navbar from "./components/Navbar";
import MenuDrawer from "./components/MenuDrawer";
import FilterTabs from "./components/FilterTabs";
import AlertList from "./components/AlertList";
import GoogleMap from "./components/Map";
import Footer from "./components/Footer";
import FilterModal from "./components/modals/FilterModal";
import MySearchesModal from "./components/modals/MySearchesModal";
import MyAlertsModal from "./components/modals/MyAlertsModal";
import SubscribeModal from "./components/modals/SubscribeModal";

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
// Visible if menuOpen is true OR modalOpen is not null
// Clicking the overlay sets menuOpen to false and modalOpen to null
// Closes the drawer and any open modal when clicking outside
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
