export default function MenuDrawer({
  menuOpen,
  menuClose,
}: {
  menuOpen: boolean;
  menuClose: () => void;
}) {
  return (
    <div className={menuOpen ? "drawer-visible" : "drawer-hidden"}>
      <div className="drawer-header">
        <button onClick={menuClose}>✕</button>
      </div>
      <ul>
        <li>
          <button className="drawer-menu-button">Filter</button>
        </li>
        <li>
          <button className="drawer-menu-button">My Searches</button>
        </li>
        <li>
          <button className="drawer-menu-button">My Alerts</button>
        </li>
      </ul>
    </div>
  );
}
