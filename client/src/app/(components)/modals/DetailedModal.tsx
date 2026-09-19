"use client";

import { MenuContext } from "@/context/MenuContext";
import { AlertsContext } from "@/context/AlertsContext";
import { useContext } from "react";
import FireDetail from "./FireDetail";
import TrafficDetail from "./TrafficDetail";
import { displayFormat } from "@/app/lib/utils";

export default function DetailedModal() {
  const { modalOpen, toggleMenu } = useContext(MenuContext);
  const isOpen = modalOpen === "detailedModal";
  const onClose = () => {
    toggleMenu(false, null);
  };
  const {
    selectedAlert: alert,
    updateSelectedAlert,
    updateSelectedMarker,
    addSubscribedAlert,
    removeSubscribedAlert,
    subscribedAlertTitles,
  } = useContext(AlertsContext);

  if (alert === null) return null; //if alert is null render nothing

  return (
    <div
      className={
        isOpen ? "detail-modal-container-visible" : "modal-container-hidden"
      }
    >
      <div className="modal-header">
        <button
          onClick={() => {
            updateSelectedAlert(null);
            updateSelectedMarker(null);
            onClose();
          }}
        >
          ✕
        </button>
      </div>
      <h4>{displayFormat(alert?.title)}</h4>
      {alert.source_id === 1 ? (
        <FireDetail alert={alert} />
      ) : (
        <TrafficDetail alert={alert} />
      )}
      <div className="subscribe-section">
        <p>Click to subscribe</p>
        <input
          type="checkbox"
          checked={subscribedAlertTitles.includes(alert.title)}
          onChange={() =>
            subscribedAlertTitles.includes(alert.title)
              ? removeSubscribedAlert(alert.title)
              : addSubscribedAlert(alert.title)
          }
        />
      </div>
    </div>
  );
}
