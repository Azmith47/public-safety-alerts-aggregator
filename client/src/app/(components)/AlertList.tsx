"use client";

import { Alert } from "../lib/definitions";
import { useContext, useEffect } from "react";
import { AlertsContext } from "@/context/AlertsContext";
import { MenuContext } from "@/context/MenuContext";
import { FilterContext } from "@/context/FilterContext";

function getIcon(type: number) {
  if ((type = 2))
    return <img className="icon" src="\icons\traffic.svg" alt="" />;
  if ((type = 1)) return <img className="icon" src="\icons\fire.svg" alt="" />;
  if ((type = 4)) return <img className="icon" src="\icons\flood.svg" alt="" />;
  if ((type = 5)) return <img className="icon" src="\icons\storm.svg" alt="" />;
}

// Renders the AlertCard
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
      {/* If active is true display the dot-active CSS class, otherwise display the dot-inactive CSS class */}
      <span className={alert.is_active ? "dot-active" : "dot-inactive"}>
        {alert.is_active ? "Active" : "Inactive"}
      </span>
      <div className="alert-card-top">
        <p>x hours ago</p>
      </div>
      <div className="alert-card-middle">
        <p>{getIcon(alert.category_id)}</p>
        <p>{alert.title}</p>
      </div>
      <div className="alert-card-bottom">
        <p>alert region and suburb</p>
      </div>
    </article>
  );
}

// Hardcoded data needs to be replaced with API fetch (useEffect?)
// Each AlertCard will receive JSON alert data as props
export default function AlertList() {
  const { alerts, updateAlerts, selectedAlert, updateSelectedAlert } =
    useContext(AlertsContext);
  const { modalOpen } = useContext(MenuContext);
  const { filters } = useContext(FilterContext);

  useEffect(() => {
    // Fetch alerts from API and update context
    fetch("http://localhost:3001/alerts/")
      .then((response) => response.json())
      .then((data) => {
        // Update the alerts in the context
        updateAlerts(data.rows);
        console.log(data.rows[0]);
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
    return true;
  });

  return (
    <aside>
      <ul>
        {filteredAlerts.map((alert) => (
          <li key={alert.id}>
            <AlertCard alert={alert} />
          </li>
        ))}
      </ul>
    </aside>
  );
}
