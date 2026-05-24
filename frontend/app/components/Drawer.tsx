export default function MenuDrawer({ menuOpen }: { menuOpen: boolean }) {
  return (
    <div className={menuOpen ? "drawer-visible" : "drawer-hidden"}>
      <div className="drawer-header">
        <button>✕</button>
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
