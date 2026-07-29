"use client";
import SubscribeModal from "./components/SubscribeModal";
import Footer from "./components/Footer";
import AlertList from "./components/AlertList";
import Navbar from "./components/Navbar";
import MenuDrawer from "./components/Drawer";
import FilterTabs from "./components/FilterTabs";
import { useState } from "react";
import GoogleMap from "./components/Map";
import FilterModal from "./components/FilterModal";
import MySearchesModal from "./components/MySearchesModal";

export default function Home() {
  //State variables
  const [menuOpen, setMenuOpen] = useState(false); //belongs menu (opened via hamburger icon)
  const [subscribeOpen, setSubscribeOpen] = useState(false); //belongs to subscribe modal (opened via bell icon)
  // State variables for filter, MySearches, and MyAlerts
  // Requires consolidation, state variables are becoming too messy
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [mySearchesModalOpen, setMySearchesModalOpen] = useState(false);

  // Event handlers are defined below / both are passed to Navbar as props
  // handleMenuClick() reverses the state of menuOpen when the hamburger icon is clicked
  function handleMenuClick() {
    setMenuOpen(!menuOpen);
  }

  //handleAlertMenuClick() reverses the state of alertsOpen when the bell icon is clicked
  function handleAlertMenuClick() {
    setSubscribeOpen(!subscribeOpen);
  }

  return (
    <>
      <PageOverlay
        menuOpen={menuOpen}
        subscribeOpen={subscribeOpen}
        filterModalOpen={filterModalOpen}
        mySearchesModalOpen={mySearchesModalOpen}
        onClick={() => {
          setMenuOpen(false);
          setSubscribeOpen(false);
          setFilterModalOpen(false);
          setMySearchesModalOpen(false);
        }}
      />
      <Navbar
        onMenuClick={handleMenuClick}
        onAlertsClick={handleAlertMenuClick}
      />
      <MenuDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onFilterClick={() => setFilterModalOpen(true)}
        onMySearchesClick={() => setMySearchesModalOpen(true)}
      />
      <main>
        <AlertList />
        <div className="map-area">
          <FilterTabs />
          <GoogleMap />
        </div>
      </main>
      <Footer />
      <SubscribeModal
        isOpen={subscribeOpen}
        onClose={() => setSubscribeOpen(false)}
      />
      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
      />
      <MySearchesModal
        isOpen={mySearchesModalOpen}
        onClose={() => setMySearchesModalOpen(false)}
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
  subscribeOpen,
  filterModalOpen,
  mySearchesModalOpen,
  onClick,
}: {
  menuOpen: boolean;
  subscribeOpen: boolean;
  filterModalOpen: boolean;
  mySearchesModalOpen: boolean;
  onClick: () => void;
}) {
  if (
    menuOpen === true ||
    subscribeOpen === true ||
    filterModalOpen ||
    mySearchesModalOpen
  ) {
    return <div className="page-overlay" onClick={onClick}></div>;
  }
}
