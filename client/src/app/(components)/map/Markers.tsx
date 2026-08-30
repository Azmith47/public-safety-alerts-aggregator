"use client";

import { useEffect, useContext } from "react";
import { AlertsContext } from "../../../context/AlertsContext";
import { MenuContext } from "../../../context/MenuContext";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { MarkerClusterer, type Renderer } from "@googlemaps/markerclusterer";

import { MarkerType } from "../../lib/definitions";

type MarkersProps = {
  map: google.maps.Map | null;
  markers: MarkerType[];
};

type AlertMarker = google.maps.marker.AdvancedMarkerElement & {
  alertType?: number;
};

export default function Markers({ map, markers }: MarkersProps) {
  const { updateSelectedMarker, alerts, updateSelectedAlert } =
    useContext(AlertsContext);
  const { toggleMenu } = useContext(MenuContext);

  const resolveAlertDetails = async (alertId: number) => {
    const alertFromList = alerts.find((alert) => alert.id === alertId);

    if (alertFromList) {
      updateSelectedMarker(alertFromList);
      updateSelectedAlert(alertFromList);
      toggleMenu(false, "detailedModal");
      return;
    }

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${baseUrl}/alerts/${alertId}`);

      if (!response.ok) {
        throw new Error(`Failed to load alert ${alertId}`);
      }

      const data = await response.json();
      const alertDetails = data?.alert ?? data ?? null;

      if (!alertDetails) {
        updateSelectedMarker(null);
        updateSelectedAlert(null);
        return;
      }

      updateSelectedMarker(alertDetails);
      updateSelectedAlert(alertDetails);
      toggleMenu(false, "detailedModal");
    } catch (error) {
      console.error("Failed to load alert details for marker selection:", error);
      updateSelectedMarker(null);
      updateSelectedAlert(null);
    }
  };
  /*
   * Load the Google Maps marker library.
   *
   * This provides:
   * - AdvancedMarkerElement
   * - PinElement
   */
  const markerLibrary = useMapsLibrary("marker");

  useEffect(() => {
    /*
     * Don't create markers until both the map
     * and marker library are available.
     */
    if (!map || !markerLibrary) {
      return;
    }

    /////////////////////////////Uncomment this to revert
    /*
     * Create the individual Google Maps markers.
     */
    // const googleMarkers: AlertMarker[] = markers.map((marker) => {
    /*
     * Create the pin used for individual alerts.
     */
    // const pin = new markerLibrary.PinElement({
    //   background: marker.alertType === 1 ? "red" : "yellow",

    //   borderColor: "black",

    //   glyphColor: "white",
    // });

    /*
     * Create the Google Maps AdvancedMarkerElement.
     */
    // const googleMarker = new markerLibrary.AdvancedMarkerElement({
    //   position: marker.coordinates,

    //   content: pin,

    //   title: `Alert ${marker.alertId}`,
    // }) as AlertMarker;

    /*
     * Store the alert type on the Google Maps
     * marker so the cluster renderer can inspect it.
     */
    // googleMarker.alertType = marker.alertType;

    /*
     * Clicking an individual alert:
     * - pan to the alert
     * - zoom to level 8
     */

    //TEST CODE:
    const googleMarkers: AlertMarker[] = markers.map((marker) => {
      const img = document.createElement("img");
      img.src =
        marker.alertType === 1 || marker.alertType === 10 || marker.alertType === 7 ? "/icons/fire.svg" : "/icons/traffic.svg";
      img.style.width = "50px";
      img.style.height = "50px";

      const googleMarker = new markerLibrary.AdvancedMarkerElement({
        position: marker.coordinates,
        content: img,
        title: `Alert ${marker.alertId}`,
      }) as AlertMarker;
      googleMarker.alertType = marker.alertType;
      googleMarker.addListener("gmp-click", () => {
        map.panTo(marker.coordinates);
        map.setZoom(11);
        void resolveAlertDetails(marker.alertId);
      });
      return googleMarker;
    });

    /*
     * Custom renderer for clusters.
     */
    const renderer: Renderer = {
      render({ count, position, markers: clusterMarkers }) {
        /*
         * Determine which types of alerts are
         * contained in this cluster.
         */
        const hasFireAlerts = clusterMarkers.some(
          (marker) => (marker as AlertMarker).alertType === 1,
        );

        const hasTrafficAlerts = clusterMarkers.some(
          (marker) => (marker as AlertMarker).alertType !== 1,
        );

        /*
         * Determine the cluster background.
         *
         * Fire only:
         *   red
         *
         * Traffic only:
         *   yellow
         *
         * Mixed:
         *   half red / half yellow
         */
        let background: string;

        if (hasFireAlerts && hasTrafficAlerts) {
          background =
            "linear-gradient(" +
            "90deg, " +
            "red 0%, " +
            "red 50%, " +
            "yellow 50%, " +
            "yellow 100%" +
            ")";
        } else if (hasFireAlerts) {
          background = "red";
        } else {
          background = "yellow";
        }

        /*
         * Create the cluster element.
         */
        const div = document.createElement("div");

        div.style.width = "44px";
        div.style.height = "44px";

        div.style.borderRadius = "50%";

        div.style.background = background;

        div.style.border = "3px solid black";

        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.justifyContent = "center";

        div.style.boxSizing = "border-box";

        /*
         * Create the black circle behind
         * the cluster count.
         */
        const countDiv = document.createElement("div");

        /*
         * Give three-digit counts a little
         * more room.
         */
        const badgeSize = count >= 100 ? 28 : 24;

        countDiv.style.width = `${badgeSize}px`;

        countDiv.style.height = `${badgeSize}px`;

        countDiv.style.borderRadius = "50%";

        countDiv.style.background = "black";

        countDiv.style.color = "white";

        countDiv.style.display = "flex";

        countDiv.style.alignItems = "center";

        countDiv.style.justifyContent = "center";

        countDiv.style.fontSize = count >= 100 ? "10px" : "12px";

        countDiv.style.fontWeight = "bold";

        countDiv.style.lineHeight = "1";

        countDiv.style.boxSizing = "border-box";

        /*
         * Display the number of alerts
         * contained in the cluster.
         */
        countDiv.textContent = String(count);

        /*
         * Put the count badge inside
         * the coloured cluster.
         */
        div.appendChild(countDiv);

        /*
         * Return an AdvancedMarkerElement
         * for the cluster itself.
         */
        return new markerLibrary.AdvancedMarkerElement({
          position,

          content: div,

          /*
           * Make clusters appear above
           * normal markers.
           */
          zIndex: google.maps.Marker.MAX_ZINDEX + count,
        });
      },
    };

    /*
     * Create the MarkerClusterer.
     */
    const clusterer = new MarkerClusterer({
      map,

      markers: googleMarkers,

      renderer,
    });

    /*
     * Clean up when:
     * - markers change
     * - map changes
     * - component unmounts
     */
    return () => {
      clusterer.clearMarkers();
      clusterer.setMap(null);
    };
  }, [map, markerLibrary, markers]);

  /*
   * All marker rendering is handled
   * directly by Google Maps.
   */
  return null;
}
