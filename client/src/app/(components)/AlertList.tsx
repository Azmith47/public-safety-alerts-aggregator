"use client";

import { Alert } from "../lib/definitions";
import { useContext, useEffect, useRef } from "react";
import { AlertsContext } from "@/context/AlertsContext";
import { MenuContext } from "@/context/MenuContext";
import { FilterContext } from "@/context/FilterContext";
import Image from "next/image";
import { convertTime, removeFormatting } from "../lib/utils";

//Fire = 1,7,10
//Traffic = 2,3
//Flood = 4
//Public event = 11
//Other = 12
//5,6,8,9 have no entries in the db
function getIcon(category_id: number) {
  if (
    Number(category_id) === 1 ||
    Number(category_id) === 7 ||
    Number(category_id) === 10
  )
    return (
      <Image
        className="icon"
        src="\icons\fire.svg"
        alt="fire icon"
        width={0}
        height={0}
      />
    );
  if (Number(category_id) === 2 || Number(category_id) === 3)
    return (
      <Image
        className="icon"
        src="\icons\traffic.svg"
        alt="traffic icon"
        width={10}
        height={10}
      />
    );
  if (Number(category_id) === 4) {
    return (
      <Image
        className="icon"
        src="\icons\flood.svg" //PLACEHOLDER
        alt="other alert icon"
        width={10}
        height={10}
      />
    );
  }
  if (Number(category_id) === 11 || Number(category_id) === 12) {
    return (
      <Image
        className="icon"
        src="\icons\OTHER.svg"
        alt="other alert icon"
        width={10}
        height={10}
      />
    );
  } else
    return (
      <Image
        className="icon"
        src="\icons\kek.svg"
        alt="other alert icon"
        width={10}
        height={10}
      />
    );
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
        <p>{getIcon(alert.category_id)}</p>
        <p>{removeFormatting(alert.title)}</p>
      </div>
      <div className="alert-card-bottom">
        <p>{removeFormatting(alert.location_council_area)}</p>
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
