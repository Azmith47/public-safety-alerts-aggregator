function AlertCard({
  title,
  location,
  agency,
}: {
  title: string;
  location: string;
  agency: string;
}) {
  return (
    <article>
      <h3>{title}</h3>
      <p>{location}</p>
      <p>{agency}</p>
    </article>
  );
}

export default function AlertList() {
  return (
    <aside>
      <p>Results:</p>
      <ul>
        <li>
          <AlertCard
            title="fire warning"
            location="Wollondilly LGA"
            agency="RFS"
          />
        </li>
        <li>
          <AlertCard
            title="Flood Watch"
            location="Hawkesbury LGA"
            agency="BOM"
          />
        </li>
        <li>
          <AlertCard
            title="Severe Thunderstorm Warning"
            location="Blue Mountains LGA"
            agency="BOM"
          />
        </li>
      </ul>
    </aside>
  );
}
