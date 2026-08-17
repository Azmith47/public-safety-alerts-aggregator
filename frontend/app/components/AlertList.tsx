import { alerts } from "../lib/placeholder-data";
import { AlertListProps } from "../lib/definitions";
import { Alert } from "../lib/definitions";

// Renders a different .svg icon determined by the type prop passed to the AlertCard
// A switch statement could be more appropriate
// The icons are are placeholder - needs to be discussed by the team
function getIcon(type: string) {
  if (type === "traffic")
    return <img className="icon" src="\icons\traffic.svg" alt="" />;
  if (type === "fire")
    return <img className="icon" src="\icons\fire.svg" alt="" />;
  if (type === "flood")
    return <img className="icon" src="\icons\flood.svg" alt="" />;
  if (type === "storm")
    return <img className="icon" src="\icons\storm.svg" alt="" />;
}

// Renders the AlertCard
function AlertCard({
  alert,
  onAlertClick,
}: {
  alert: Alert;
  onAlertClick: (alert: Alert) => void;
}) {
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
          {alert.alertLocation.region}, {alert.alertLocation.suburb}
        </p>
      </div>
    </article>
  );
}

// The alert data was hardcoded for the prototype
// Hardcoded data needs to be replaced with API fetch (useEffect?)
// Each AlertCard will receive JSON alert data as props
export default function AlertList({ onAlertClick }: AlertListProps) {
  return (
    <aside>
      <ul>
        {alerts.map((alert) => (
          <li key={alert.id}>
            {/* used spread operator to copy all the alert properties to AlertCard as props - otherwise we'd be typing them all manually */}
            <AlertCard {...alert} onAlertClick={onAlertClick} alert={alert} />
          </li>
        ))}
      </ul>
    </aside>
  );
}
