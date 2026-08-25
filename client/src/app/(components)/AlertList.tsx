"use client";

import { Alert } from "../lib/definitions";
import { useContext, useEffect, useRef } from "react";
import { AlertsContext } from "@/context/AlertsContext";
import { MenuContext } from "@/context/MenuContext";
import { FilterContext } from "@/context/FilterContext";

function getIcon(source_id: number) {
  if (Number(source_id) === 1)
    return <img className="icon" src="\icons\fire.svg" alt="" />;
  if (Number(source_id) === 2)
    return <img className="icon" src="\icons\traffic.svg" alt="" />;
  else {
    return <img className="" src="" alt="this is broken" />;
  }
}

//Show issued + updated time relative to current time
export function convertTime(date: string) {
  const issuedDate = new Date(date).getTime();
  const currentDate = Date.now();
  const timeDifference = currentDate - issuedDate;

  const minutesSinceIssue = Math.floor(timeDifference / (1000 * 60));
  const hoursSinceIssue = Math.floor(timeDifference / (1000 * 60 * 60));
  const daysSinceIssue = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (minutesSinceIssue < 1) {
    return "just now";
  }
  if (minutesSinceIssue >= 1 && minutesSinceIssue < 60) {
    return `${minutesSinceIssue} minutes ago`;
  }
  if (hoursSinceIssue >= 1 && hoursSinceIssue < 24) {
    return `${hoursSinceIssue} hours ago`;
  }
  return `${daysSinceIssue} days ago`;
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
        <p>
          <strong>last update:</strong> {convertTime(alert.updated_at)}
        </p>
      </div>
    </article>
  );
}

export default function AlertList() {
  const { alerts, updateAlerts, selectedAlert, updateSelectedAlert, selectedMarker } =
    useContext(AlertsContext);
  const { modalOpen } = useContext(MenuContext);
  const { filters } = useContext(FilterContext);

  const listRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    console.log(selectedAlert)
  }, [selectedAlert])

  useEffect(() => {
    if(listRef.current){
      if(selectedMarker !== null){
        listRef.current.scrollTop = 0
      }
    }
  }, [selectedMarker])

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
    return true;
  });

  return (
    <aside ref={listRef} style={{overflowY: 'auto'}}>
      <ul>
        {selectedMarker !== null ? (
          <li className="focussed" key={selectedMarker.id}>
              <AlertCard alert={selectedMarker}/>
          </li>
        ) : null}
        {filteredAlerts.map((alert) => (
          alert.id !== selectedMarker?.id ?
          (<li key={alert.id}>
            <AlertCard alert={alert} />
          </li>) : null
        ))}
      </ul>
    </aside>
  );
}
