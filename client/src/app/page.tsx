import Navbar from "./(components)/Navbar";
import MenuDrawer from "./(components)/MenuDrawer";
import { FilterTabs } from "./(components)/modals/FilterModal";
import AlertList from "./(components)/AlertList";
import GoogleMap from "./(components)/AlertsMap";
import Footer from "./(components)/Footer";
import FilterModal from "./(components)/modals/FilterModal";
import MySearchesModal from "./(components)/modals/MySearchesModal";
import MyAlertsModal from "./(components)/modals/MyAlertsModal";
import SubscribeModal from "./(components)/modals/SubscribeModal";
import DetailedModal from "./(components)/modals/DetailedModal";
import PageOverlay from "./(components)/PageOverlay";
import { MenuProvider } from "@/context/MenuContext";
import { Suspense } from "react";
import { AlertsProvider } from "@/context/AlertsContext";
import { FilterProvider } from "@/context/FilterContext";

export default function Home() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || "";

  return (
    <MenuProvider>
      <PageOverlay />
      <Navbar />
      <MenuDrawer />
      <SubscribeModal />
      <FilterProvider>
        <FilterModal />
        <MySearchesModal />
        <AlertsProvider>
          <DetailedModal />
          <MyAlertsModal />

          <main>
            <AlertList />

            <div className="map-area">
              <FilterTabs />
              <Suspense fallback={<div>Loading...</div>}>
                <GoogleMap apiKey={apiKey} />
              </Suspense>
            </div>
          </main>
          <Footer />
        </AlertsProvider>
      </FilterProvider>
    </MenuProvider>
  );
}
