import { AlertListProps, Alert } from "../lib/definitions";

// Renders a different .svg icon determined by alert type
// A switch statement could be more appropriate
// The icons are are placeholder
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

// Hardcoded data needs to be replaced with API fetch (useEffect?)
// Each AlertCard will receive JSON alert data as props
export default function AlertList({ alerts, onAlertClick }: AlertListProps) {
  return (
    <aside>
      <ul>
        {alerts.map((alert) => (
          <li key={alert.id}>
            <AlertCard onAlertClick={onAlertClick} alert={alert} />
          </li>
        ))}
      </ul>
    </aside>
  );
}
