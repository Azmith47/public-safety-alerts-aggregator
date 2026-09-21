"use client";

import { Alert } from "../lib/definitions";
import { useContext, useEffect } from "react";
import { AlertsContext } from "@/context/AlertsContext";
import { MenuContext } from "@/context/MenuContext";


// The alert data was hardcoded for the prototype
// Hardcoded data needs to be replaced with API fetch (useEffect?)
// Each AlertCard will receive JSON alert data as props
// export default function AlertList() {
//   return (
//     <aside>
//       <ul>
//         {alerts.map((alert) => (
//           <li key={alert.id}>
//             {/* used spread operator to copy all the alert properties to AlertCard as props - otherwise we'd be typing them all manually */}
//             <AlertCard {...alert} />
//           </li>
//         ))}
//       </ul>
//     </aside>
//   );
// }

// Renders the AlertCard
// Category is passed as a prop but not displayed due to size constraints
// function AlertCard({
//   title,
//   type,
//   alertLocation: { region, suburb },
//   datePublished,
//   active,
// }: AlertCardProps) {
//   return (
//     <article className={active ? "alert-card-active" : "alert-card-inactive"}>
//       {/* If active is true display the dot-active CSS class, otherwise display the dot-inactive CSS class */}
//       <span className={active ? "dot-active" : "dot-inactive"}>
//         {active ? "Active" : "Inactive"}
//       </span>
//       <div className="alert-card-top">
//         <p>{datePublished}</p>
//       </div>
//       <div className="alert-card-middle">
//         <p>{getIcon(type)}</p>
//         <p>{title}</p>
//       </div>
//       <div className="alert-card-bottom">
//         <p>
//           {region}, {suburb}
//         </p>
//       </div>
//     </article>
//   );
// }

// Renders a different .svg icon determined by the type prop passed to the AlertCard
// A switch statement could be more appropriate
// The icons are are placeholder - needs to be discussed by the team
// function getIcon(type: string) {
//   if (type === "traffic")
//     return <img className="icon" src="\icons\traffic.svg" alt="" />;
//   if (type === "fire")
//     return <img className="icon" src="\icons\fire.svg" alt="" />;
//   if (type === "flood")
//     return <img className="icon" src="\icons\flood.svg" alt="" />;
//   if (type === "storm")
//     return <img className="icon" src="\icons\storm.svg" alt="" />;
// }

// Renders a different .svg icon determined by alert type
// A switch statement could be more appropriate
// The icons are are placeholder
function getIcon(type: number) {
  if (type = 2)
    return <img className="icon" src="\icons\traffic.svg" alt="" />;
  if (type = 1)
    return <img className="icon" src="\icons\fire.svg" alt="" />;
  if (type = 4)
    return <img className="icon" src="\icons\flood.svg" alt="" />;
  if (type = 5)
    return <img className="icon" src="\icons\storm.svg" alt="" />;
}

// Renders the AlertCard
function AlertCard({alert}: {alert: Alert;}) {
  const { toggleMenu } = useContext(MenuContext);
  const { selectedAlert, updateSelectedAlert } = useContext(AlertsContext);

  function onAlertClick(alert: Alert) {
    toggleMenu(false, "detailedModal");
    updateSelectedAlert(alert);
  }

  return (
    <article
      className={alert.active ? "alert-card-active" : "alert-card-inactive"}
      onClick={() => onAlertClick(alert)}
    >
      {/* If active is true display the dot-active CSS class, otherwise display the dot-inactive CSS class */}
      <span className={alert.active ? "dot-active" : "dot-inactive"}>
        {alert.active ? "Active" : "Inactive"}
      </span>
      <div className="alert-card-top">
        <p>{alert.datePublished}</p>
      </div>
      <div className="alert-card-middle">
        <p>{getIcon(alert.type)}</p>
        <p>{alert.title}</p>
      </div>
      <div className="alert-card-bottom">
        <p>
          {/* {alert.alertLocation.region}, {alert.alertLocation.suburb} */}
        </p>
      </div>
    </article>
  );
}

// Hardcoded data needs to be replaced with API fetch (useEffect?)
// Each AlertCard will receive JSON alert data as props
export default function AlertList() {
  const { alerts, updateAlerts, selectedAlert, updateSelectedAlert } = useContext(AlertsContext);
  const { modalOpen } = useContext(MenuContext);

  useEffect(() => {
    // Fetch alerts from API and update context
    fetch("http://localhost:3001/alerts/")
      .then((response) => response.json())
      .then((data) => {
        // Update the alerts in the context
        updateAlerts(data.rows);
      });
  }, []);

  useEffect(() => {
  }, [modalOpen]);

  return (
    <aside>
      <ul>
        {alerts.map((alert) => (
          <li key={alert.id}>
            <AlertCard alert={alert} />
          </li>
        ))}
      </ul>
    </aside>
  );
}
