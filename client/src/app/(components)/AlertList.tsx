"use client";

import { Alert } from "../lib/definitions";
import { useContext, useEffect, useRef } from "react";
import { AlertsContext } from "@/context/AlertsContext";
import { MenuContext } from "@/context/MenuContext";
import { FilterContext } from "@/context/FilterContext";
import Image from "next/image";
import { convertTime, removeFormatting } from "../lib/utils";

function getIcon(source_id: number) {
  if (Number(source_id) === 1)
    return (
      <Image
        className="icon"
        src="\icons\fire.svg"
        alt="fire icon"
        width={0}
        height={0}
      />
    );
  if (Number(source_id) === 2)
    return (
      <Image
        className="icon"
        src="\icons\traffic.svg"
        alt="traffic icon"
        width={10}
        height={10}
      />
    );
  else {
    return (
      <Image className="" src="" alt="this is broken" width={10} height={10} />
    );
  }
}

function AlertCard({ alert }: { alert: Alert }) {
  const { toggleMenu } = useContext(MenuContext);
  const { selectedAlert, updateSelectedAlert } = useContext(AlertsContext);

  function onAlertClick(alert: Alert) {
    toggleMenu(false, "detailedModal");
    updateSelectedAlert(alert);
  }

  return (
    <article
      className={alert.is_active ? "alert-card-active" : "alert-card-inactive"}
      onClick={() => onAlertClick(alert)}
    >
      <div className="alert-card-top">
        <span className={alert.is_active ? "dot-active" : "dot-inactive"}>
          {alert.is_active ? "Active" : "Inactive"}
        </span>
        <p>
          <strong>Issued:</strong> {convertTime(alert.issued_at)}
        </p>
      </div>
      <div className="alert-card-middle">
        <p>{getIcon(alert.source_id)}</p>
        <p>{alert.title}</p>
      </div>
      <div className="alert-card-bottom">
        <p>{alert.location_council_area}</p>
        <p>{alert.location_region}</p>
      </div>
    </article>
  );
}

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
    console.log(selectedAlert);
  }, [selectedAlert]);

  useEffect(() => {
    if (listRef.current) {
      if (selectedMarker !== null) {
        listRef.current.scrollTop = 0;
      }
    }
  }, [selectedMarker]);

  useEffect(() => {
    // Fetch alerts from API and update context
    fetch("http://localhost:3001/alerts/?limit=10000")
      .then((response) => response.json())
      .then((data) => {
        // Update the alerts in the context
        updateAlerts(data.rows);
      });
  }, []);

  useEffect(() => {}, [modalOpen]);

  const filteredAlerts = alerts.filter((alert) => {
    if (
      filters.is_active !== null &&
      Boolean(alert.is_active) !== filters.is_active
    ) {
      return false;
    }
    if (
      filters.source_id !== null &&
      Number(alert.source_id) !== filters.source_id
    ) {
      return false;
    }
    if (
      filters.location_council_area !== null &&
      removeFormatting(alert.location_council_area) !==
        removeFormatting(filters.location_council_area)
    ) {
      return false;
    }
    if (
      filters.location_region !== null &&
      removeFormatting(alert.location_region) !==
        removeFormatting(filters.location_region)
    ) {
      return false;
    }
    return true;
  });

  return (
    <aside ref={listRef} style={{ overflowY: "auto" }}>
      <ul>
        {selectedMarker !== null ? (
          <li className="focussed" key={selectedMarker.id}>
            <AlertCard alert={selectedMarker} />
          </li>
        ) : null}
        {filteredAlerts.map((alert) =>
          alert.id !== selectedMarker?.id ? (
            <li key={alert.id}>
              <AlertCard alert={alert} />
            </li>
          ) : null,
        )}
      </ul>
      <div className="no-results-found">
        {" "}
        {filteredAlerts.length === 0 && <p>No results found</p>}
      </div>
    </aside>
  );
}
