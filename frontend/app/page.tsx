"use client";
import { useState, useMemo } from "react";
import { alerts } from "./lib/placeholder-data";
import Navbar from "./components/Navbar";
import MenuDrawer from "./components/MenuDrawer";
import { FilterTabs } from "./components/modals/FilterModal";
import AlertList from "./components/AlertList";
import GoogleMap from "./components/Map";
import Footer from "./components/Footer";
import FilterModal from "./components/modals/FilterModal";
import MySearchesModal from "./components/modals/MySearchesModal";
import MyAlertsModal from "./components/modals/MyAlertsModal";
import SubscribeModal from "./components/modals/SubscribeModal";
import { PageOverlayProps, Alert, AlertFilters } from "./lib/definitions";
import DetailedModal from "./components/modals/DetailedModal";

export default function Home() {
  //State variables
  const [menuOpen, setMenuOpen] = useState(false); //belongs to menu (opened via hamburger icon)
  const [modalOpen, setModalOpen] = useState<string | null>(null); //modalOpen can be null or a string
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [filters, setFilters] = useState<AlertFilters>({
    active: null,
    type: null,
  });

  //Store filtered alert
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      if (filters.active !== null && filters.active !== alert.active) {
        return false;
      }
      if (filters.type !== null && filters.type !== alert.type) {
        return false;
      }
      return true;
    });
  }, [filters]);

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
        <AlertList
          alerts={filteredAlerts}
          onAlertClick={(alert) => {
            setSelectedAlert(alert);
            setModalOpen("detailed");
          }}
        />
        <div className="map-area">
          <FilterTabs filters={filters} />
          {/* <GoogleMap /> */}
        </div>
      </main>
      <Footer />
      {/* if modalOpen === "subscribe" then isOpen={true}, which changes the ternary inside the component to apply the modal-container-visible CSS class. The same idea applies to the other modals */}
      <SubscribeModal
        isOpen={modalOpen === "subscribe"}
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
      <DetailedModal
        isOpen={modalOpen === "detailed"}
        onClose={() => setModalOpen(null)}
        alert={selectedAlert}
      />
      <FilterModal
        initialFilters={filters}
        isOpen={modalOpen === "filter"}
        onApply={(newFilters) => {
          setFilters(newFilters);
          setModalOpen(null);
          setMenuOpen(false);
        }}
        onClose={() => setModalOpen(null)}
      />
    </>
  );
}

// Page Overlay component
// Visible if menuOpen is true OR modalOpen is not null
// Clicking the overlay sets menuOpen to false and modalOpen to null
// Closes the drawer and any open modal when clicking outside
function PageOverlay({ menuOpen, modalOpen, onClick }: PageOverlayProps) {
  if (menuOpen || modalOpen !== null) {
    return <div className="page-overlay" onClick={onClick}></div>;
  }
}
