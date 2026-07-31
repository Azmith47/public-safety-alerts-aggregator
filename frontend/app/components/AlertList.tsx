// The alert data was hardcoded for the prototype
// Hardcoded data needs to be replaced with API fetch (useEffect?)
// Each AlertCard will receive JSON alert data as props

export default function AlertList() {
  return (
    <aside>
      <ul>
        <li>
          <AlertCard
            title="Changed traffic conditions Mamre Road upgrade"
            type="traffic"
            category="Changed traffic conditions Changed traffic conditions Changed traffic conditions Changed traffic conditions Changed traffic conditions Changed traffic conditions Changed traffic conditions Changed traffic conditions"
            alertLocation={{
              region: "Sydney",
              suburb: "St Clair to Erskine Park",
            }}
            datePublished="18 hours ago"
            active={false}
          />
        </li>
        <li>
          <AlertCard
            title="Flood Watch - Hawkesbury River"
            type="flood"
            category="Flood Watch"
            alertLocation={{ region: "Hawkesbury", suburb: "Windsor" }}
            datePublished="2 hours ago"
            active={true}
          />
        </li>
        <li>
          <AlertCard
            title="Bush Fire Warning - Blue Mountains"
            type="fire"
            category="Bush Fire Warning"
            alertLocation={{ region: "Blue Mountains", suburb: "Katoomba" }}
            datePublished="45 minutes ago"
            active={true}
          />
        </li>
        <li>
          <AlertCard
            title="Severe Thunderstorm Warning"
            type="storm"
            category="Severe Thunderstorm Warning"
            alertLocation={{ region: "Newcastle", suburb: "Cessnock" }}
            datePublished="5 hours ago"
            active={true}
          />
        </li>
        <li>
          <AlertCard
            title="Road Closure - Pacific Highway"
            type="traffic"
            category="Road Closure"
            alertLocation={{ region: "Central Coast", suburb: "Gosford" }}
            datePublished="30 minutes ago"
            active={true}
          />
        </li>
        <li>
          <AlertCard
            title="Bush Fire Emergency - Ku-ring-gai"
            type="fire"
            category="Bush Fire Emergency Warning"
            alertLocation={{ region: "Northern Sydney", suburb: "Turramurra" }}
            datePublished="20 minutes ago"
            active={false}
          />
        </li>
        <li>
          <AlertCard
            title="Lane Closure - M1 Motorway Northbound"
            type="traffic"
            category="Lane Closure"
            alertLocation={{ region: "Sydney", suburb: "Berowra" }}
            datePublished="3 hours ago"
            active={true}
          />
        </li>
        <li>
          <AlertCard
            title="Lane Closure - M1 Motorway Northbound"
            type="traffic"
            category="Lane Closure"
            alertLocation={{ region: "Sydney", suburb: "Berowra" }}
            datePublished="3 hours ago"
            active={true}
          />
        </li>
        <li>
          <AlertCard
            title="Lane Closure - M1 Motorway Northbound"
            type="traffic"
            category="Lane Closure"
            alertLocation={{ region: "Sydney", suburb: "Berowra" }}
            datePublished="3 hours ago"
            active={false}
          />
        </li>
      </ul>
    </aside>
  );
}

// Renders the AlertCard
// Category is passed as a prop but not displayed due to size constraints

function AlertCard({
  title,
  type,
  alertLocation: { region, suburb }, //placeholder for proper backend location data
  datePublished,
  active,
}: {
  title: string;
  type: string;
  category: string;
  alertLocation: { region: string; suburb: string };
  datePublished: string;
  active: boolean;
}) {
  return (
    <article className={active ? "alert-card-active" : "alert-card-inactive"}>
      {/* If active is true display the dot-active CSS class, otherwise display the dot-inactive CSS class */}
      <span className={active ? "dot-active" : "dot-inactive"}>
        {active ? "Active" : "Inactive"}
      </span>
      <div className="alert-card-top">
        <p>{datePublished}</p>
      </div>
      <div className="alert-card-middle">
        <p>{getIcon(type)}</p>
        <p>{title}</p>
      </div>
      <div className="alert-card-bottom">
        <p>
          {region}, {suburb}
        </p>
      </div>
    </article>
  );
}

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
