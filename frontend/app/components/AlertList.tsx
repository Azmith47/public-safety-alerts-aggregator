export default function AlertList() {
  return (
    <aside>
      <p>Results:</p>
      <ul>
        <li>
          <AlertCard
            title="Changed traffic conditions Mamre Road upgrade"
            type="Traffic"
            category="Changed traffic conditions"
            alertLocation={{
              region: "Sydney",
              suburb: "St Clair to Erskine Park",
            }}
            datePublished="2024-11-08"
          />
        </li>
      </ul>
    </aside>
  );
}

function AlertCard({
  title,
  type,
  category,
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
    <button>
      <article className="alert-card">
        <div className="alert-card-top">
          <span className="dot-active"></span>
          <p>
            {getIcon("traffic")}
            {type}
          </p>
          <p>{datePublished}</p>
        </div>
        <strong>{title}</strong>
        <div className="alert-card-bottom">
          <p>
            {region}, {suburb}
          </p>
          <p>{category}</p>
        </div>
      </article>
    </button>
  );
}

function getIcon(type: string) {
  if (type === "traffic") return "🛣️";
  if (type === "fire") return "🚒";
  if (type === "flood") return "⛆";
}
