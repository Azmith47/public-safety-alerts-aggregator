"use client";
import { useContext, useEffect, useRef } from "react";
import { AlertsContext } from "@/context/AlertsContext";
import { MenuContext } from "@/context/MenuContext";
import { FilterContext } from "@/context/FilterContext";
import { normalise } from "../lib/utils";
import AlertCard from "./AlertCard";

export default function AlertList() {
  const {
    alerts,
    updateAlerts,
    selectedAlert,
    updateSelectedAlert,
    selectedMarker,
  } = useContext(AlertsContext);
  const { modalOpen } = useContext(MenuContext);
  const { filters } = useContext(FilterContext);

  const listRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (listRef.current) {
      if (selectedMarker !== null) {
        listRef.current.scrollTop = 0;
      }
    }
  }, [selectedMarker]);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    fetch(`${baseUrl}/alerts/?limit=10000`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        updateAlerts(data.rows ?? []);
      })
      .catch((error) => console.error("Failed to load alerts:", error));
  }, [updateAlerts]);

  useEffect(() => {}, [modalOpen]);

  const filteredAlerts = alerts.filter((alert) => {
    if (
      filters.is_active !== null &&
      Boolean(alert.is_active) !== filters.is_active
    ) {
      return false;
    }
    if (
      filters.category_id !== null &&
      Number(alert.category_id) !== filters.category_id
    ) {
      return false;
    }
    if (
      filters.location_council_area !== null &&
      normalise(alert.location_council_area) !==
        normalise(filters.location_council_area)
    ) {
      return false;
    }
    if (
      filters.location_region !== null &&
      normalise(alert.location_region) !== normalise(filters.location_region)
    ) {
      return false;
    }
    return true;
  });

  return (
    <aside ref={listRef} style={{ overflowY: "auto" }}>
      <ul>
        {filteredAlerts.map((alert) => (
          <li
            key={alert.id}
            className={alert.id === selectedMarker?.id ? "focussed" : ""}
          >
            <AlertCard alert={alert} />
          </li>
        ))}
      </ul>
      <div className="no-results-found">
        {" "}
        {filteredAlerts.length === 0 && <p>No results found</p>}
      </div>
    </aside>
  );
}
