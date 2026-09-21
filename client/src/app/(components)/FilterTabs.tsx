// This is hardcoded for now
// Eventually it should show which filter terms were selected by the user
// The selected filter terms should match the output of the alert list
// Selected filters will be stored in an array
// Removing a filter from the UI should also remove it from the selecte filters array
// Removing the filter term can be achieved by clicking the x
// The alert list will re-render to reflect the change
// The state for filter will need to be accessible by FilterTabs and AlertList

export default function FilterTabs() {
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
