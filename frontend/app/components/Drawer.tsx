export default function MenuDrawer({
  isOpen, //The isOpen prop receives the state variable from page.tsx
  onClose, //OnClose returns nothing and is defined in page.tsx
  onFilterClick,
  onMySearchesClick,
}: {
  isOpen: boolean;
  onClose: () => void;
  onFilterClick: () => void;
  onMySearchesClick: () => void;
}) {
  return (
    //Visibility of the modal is determined by a ternary that swaps the CSS class
    //The drawer is hidden unless isOpen is true
    <div className={isOpen ? "drawer-visible" : "drawer-hidden"}>
      <div className="drawer-header">
        {/* Sets isOpen to false, changing the CSS class to drawer-hidden */}
        <button onClick={onClose}>✕</button>
      </div>
      <ul>
        <li>
          <button className="drawer-menu-button" onClick={onFilterClick}>
            Filter
          </button>
        </li>
        <li>
          <button className="drawer-menu-button" onClick={onMySearchesClick}>
            My Searches
          </button>
        </li>
        <li>
          <button className="drawer-menu-button">My Alerts</button>
        </li>
      </ul>
    </div>
  );
}
