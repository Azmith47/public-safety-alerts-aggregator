"use client";

import { useContext } from "react";
import { MenuContext } from "@/context/MenuContext";

// Collection of alerts
// Saved when the user ticks the 'subscribe to this alert' checkbox?
// I'm not sure how to do this yet
export default function MyAlertsModal() {
  const { modalOpen, toggleMenu } = useContext(MenuContext);
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
      <form action="" className="modal-form"></form>
    </div>
  );
}
