export default function FilterArea() {
  const filters = ["Fire", "Flood", "Active", "Inactive", "BOM", "RFS", "SES"];
  return (
    <div className="filter-bar">
      {filters.map((filter) => (
        <div className="filter-items" key={filter}>
          <span>{filter}</span>
        </div>
      ))}
    </div>
  );
}
