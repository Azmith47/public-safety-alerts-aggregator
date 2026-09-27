// "use client";

// import { useContext } from "react";
// import { MenuContext } from "@/context/MenuContext";
// import { AlertsContext } from "@/context/AlertsContext";
// import { FilterContext } from "@/context/FilterContext";

// export default function MyAlertsModal() {
//   const { modalOpen, toggleMenu } = useContext(MenuContext);
//   //subscription
//   const { subscribedAlertTitles } = useContext(AlertsContext);
//   const isOpen = modalOpen === "myAlerts";
//   const onClose = () => toggleMenu(false, null);

//   //

//   return (
//     <div
//       className={isOpen ? "modal-container-visible" : "modal-container-hidden"}
//     >
//       <div className="modal-header">
//         <button onClick={onClose}>✕</button>
//       </div>
//       <h4>Alert Subscriptions</h4>
//       <ul>
//         {subscribedAlertTitles.map((title, i) => (
//           <li key={i}>{title}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

"use client";

import { useContext, useEffect, useState } from "react";
import { MenuContext } from "@/context/MenuContext";
import { API_URL } from "@/app/lib/utils";
import { CATEGORIES, REGIONS, formatLabel } from "@/app/lib/utils";

const categoryName = (id: number | null) =>
  id
    ? formatLabel(CATEGORIES.find((c) => c.id === id)?.name ?? "Unknown")
    : "Any";

const regionName = (id: number | null) =>
  id ? formatLabel(REGIONS.find((r) => r.id === id)?.name ?? "Unknown") : "Any";

type Subscription = {
  id: number;
  category_id: number | null;
  region_id: number | null;
  is_enabled: boolean;
};

export default function MyAlertsModal() {
  const { modalOpen, toggleMenu } = useContext(MenuContext);
  const isOpen = modalOpen === "myAlerts";
  const onClose = () => toggleMenu(false, null);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const storedEmail = localStorage.getItem("subscriberEmail");
    setEmail(storedEmail);
    if (!storedEmail) return;

    setLoading(true);
    fetch(`${API_URL}/subscriptions?email=${encodeURIComponent(storedEmail)}`)
      .then((res) => res.json())
      .then((data) => setSubscriptions(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_URL}/subscriptions/${id}`, { method: "DELETE" });
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={isOpen ? "modal-container-visible" : "modal-container-hidden"}
    >
      <div className="modal-header">
        <button onClick={onClose}>✕</button>
      </div>
      <h4>Alert Subscriptions</h4>

      {!email && <p>No subscriptions found on this device yet.</p>}
      {loading && <p>Loading…</p>}

      <ul className="my-alerts-list">
        {subscriptions.map((sub) => (
          <li key={sub.id}>
            <span>
              {categoryName(sub.category_id)} / {regionName(sub.region_id)} —{" "}
              {sub.is_enabled ? "Active" : "Pending"}
            </span>
            <button onClick={() => handleDelete(sub.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
