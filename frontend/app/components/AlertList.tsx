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
          />
        </li>
        <li>
          <AlertCard
            title="Flood Watch - Hawkesbury River"
            type="flood"
            category="Flood Watch"
            alertLocation={{ region: "Hawkesbury", suburb: "Windsor" }}
            datePublished="2 hours ago"
          />
        </li>
        <li>
          <AlertCard
            title="Bush Fire Warning - Blue Mountains"
            type="fire"
            category="Bush Fire Warning"
            alertLocation={{ region: "Blue Mountains", suburb: "Katoomba" }}
            datePublished="45 minutes ago"
          />
        </li>
        <li>
          <AlertCard
            title="Severe Thunderstorm Warning"
            type="storm"
            category="Severe Thunderstorm Warning"
            alertLocation={{ region: "Newcastle", suburb: "Cessnock" }}
            datePublished="5 hours ago"
          />
        </li>
        <li>
          <AlertCard
            title="Road Closure - Pacific Highway"
            type="traffic"
            category="Road Closure"
            alertLocation={{ region: "Central Coast", suburb: "Gosford" }}
            datePublished="30 minutes ago"
          />
        </li>
        <li>
          <AlertCard
            title="Bush Fire Emergency - Ku-ring-gai"
            type="fire"
            category="Bush Fire Emergency Warning"
            alertLocation={{ region: "Northern Sydney", suburb: "Turramurra" }}
            datePublished="20 minutes ago"
          />
        </li>
        <li>
          <AlertCard
            title="Lane Closure - M1 Motorway Northbound"
            type="traffic"
            category="Lane Closure"
            alertLocation={{ region: "Sydney", suburb: "Berowra" }}
            datePublished="3 hours ago"
          />
        </li>
        <li>
          <AlertCard
            title="Lane Closure - M1 Motorway Northbound"
            type="traffic"
            category="Lane Closure"
            alertLocation={{ region: "Sydney", suburb: "Berowra" }}
            datePublished="3 hours ago"
          />
        </li>
        <li>
          <AlertCard
            title="Lane Closure - M1 Motorway Northbound"
            type="traffic"
            category="Lane Closure"
            alertLocation={{ region: "Sydney", suburb: "Berowra" }}
            datePublished="3 hours ago"
          />
        </li>
      </ul>
    </aside>
  );
}

function AlertCard({
  title,
  type,
  alertLocation: { region, suburb },
  datePublished,
}: {
  title: string;
  type: string;
  category: string;
  alertLocation: { region: string; suburb: string };
  datePublished: string;
}) {
  return (
    <article className="alert-card">
      <span className="dot-active"></span>
      <div className="alert-card-top">
        <p>{datePublished}</p>
      </div>
      <div className="alert-card-middle">
        {/* <p>{getIcon(type)}</p> */}
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

function getIcon(type: string) {
  if (type === "traffic")
    return <img className="icon" src="\icons\fire.svg" alt="" />;
  if (type === "fire") return "🚒";
  if (type === "flood") return "⛆";
}
