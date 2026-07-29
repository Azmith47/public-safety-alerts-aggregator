// This is hardcoded
// Eventually it should show which filter terms were selected by the user
// The filter terms should match the output of the alert list, i.e. by removing the filter from an array of selected filter
// If one of the tags is removed (by clicking the x) the alert list should update
// The state for filter will need to be accessible by FilterArea and AlertList

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
