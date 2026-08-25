"use client";

import { useContext } from "react";
import { MenuContext } from "@/context/MenuContext";
import { AlertsContext } from "@/context/AlertsContext";

export default function MyAlertsModal() {
  const { modalOpen, toggleMenu } = useContext(MenuContext);
  //subscription
  const { subscribedAlertTitles } = useContext(AlertsContext);
  const isOpen = modalOpen === "myAlerts";
  const onClose = () => toggleMenu(false, null);

  return (
    <div
      className={isOpen ? "modal-container-visible" : "modal-container-hidden"}
    >
      <div className="modal-header">
        <button onClick={onClose}>✕</button>
      </div>
      <h4>Alert Subscriptions</h4>
      <ul>
        {subscribedAlertTitles.map((title, i) => (
          <li key={i}>{title}</li>
        ))}
      </ul>
    </div>
  );
}
