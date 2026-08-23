"use client";

import { MenuContext } from "@/context/MenuContext";
import { AlertsContext } from "@/context/AlertsContext";
import { useContext } from "react";

//TODO: Display different modals for fire & traffic
//Current method DOES NOT scale well
export default function DetailedModal() {
  const { modalOpen, toggleMenu } = useContext(MenuContext);
  const isOpen = modalOpen === "detailedModal";
  const onClose = () => toggleMenu(false, null);

  const { selectedAlert: alert } = useContext(AlertsContext);

  //   if (alert === null) return null; //if alert is null render nothing
  return (
    <div
      className={
        isOpen ? "detail-modal-container-visible" : "modal-container-hidden"
      }
    >
      <div className="modal-header">
        <button onClick={onClose}>✕</button>
      </div>
      <h4>{alert?.title}</h4>
      {alert?.type === 2 ? (
        <div className="data-grid">
          <article className="labels">
            <p>Type:</p>
            <p>Category:</p>
            <p>Region:</p>
            <p>Suburb:</p>
            <p>Date Published:</p>
          </article>
          <article className="data">
            <p>{alert?.type}</p>
            <p>{alert?.category}</p>
            <p>{alert?.alertLocation.region}</p>
            <p>{alert?.alertLocation.suburb}</p>
            <p>{alert?.issued_at}</p>
          </article>
          <p style={{ color: "red", fontWeight: "bold" }}>
            This is the view for a fire alert
          </p>
        </div>
      ) : (
        <div className="data-grid">
          <article className="labels">
            <p>Type:</p>
            <p>Category:</p>
            <p>Region:</p>
            <p>Suburb:</p>
            <p>Date Published:</p>
            <p>Road:</p>
            <p>Cross Road: </p>
          </article>
          <article className="data">
            <p>{alert?.type}</p>
            <p>{alert?.category}</p>
            {/* <p>{alert?.alertLocation.region}</p>
            <p>{alert?.alertLocation.suburb}</p> */}
            <p>{alert?.issued_at}</p>
            <p>bla bla</p>
            <p>bla bla</p>
          </article>
          <p style={{ color: "green", fontWeight: "bold" }}>
            This is the view for any other type of element
          </p>
        </div>
      )}
    </div>
  );
}
