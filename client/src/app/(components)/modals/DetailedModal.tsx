"use client";

import { MenuContext } from "@/context/MenuContext";
import { AlertsContext } from "@/context/AlertsContext";
import { useContext } from "react";
import { convertTime } from "../AlertList";
import { Alert } from "@/app/lib/definitions";

//TODO: Display different modals for fire & traffic
//Current method DOES NOT scale well
export default function DetailedModal() {
  const { modalOpen, toggleMenu } = useContext(MenuContext);
  const isOpen = modalOpen === "detailedModal";
  const onClose = () => toggleMenu(false, null);

  const { selectedAlert: alert } = useContext(AlertsContext);

  if (alert === null) return null; //if alert is null render nothing

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
      {alert?.source_id === 2 ? (
        <TrafficCard alert={alert} />
      ) : (
        <>
          <p>hi</p>
        </>
      )}
    </div>
  );
}

function Firecard({ alert }: { alert: Alert }) {
  return (
    <div className="data-grid">
      <article className="labels">
        <p>title</p>
        <p>description</p>
        <p>issued_at</p>
        <p>updated_at</p>
        <p>source_url</p>
        <p>planned</p>
        <p>is_major</p>
        <p>impacting_network</p>
        <p>delay</p>
        <p>start_date</p>
        <p>end_date</p>
        <p>raw_payload</p>
      </article>
      <article className="data">
        <p>{alert.title}</p>
        <p>{alert.description}</p>
        <p>{alert.issued_at}</p>
        <p>{alert.updated_at}</p>
        <p>{alert.source_url}</p>
        <p>{alert.planned}</p>
        <p>{alert.is_major}</p>
        <p>{alert.impacting_network}</p>
        <p>{alert.delay}</p>
        <p>{alert.start_date}</p>
        <p>{alert.end_date}</p>
        <p>{alert.raw_payload}</p>
      </article>
      <p style={{ color: "red", fontWeight: "bold" }}>
        // This is the view for any other type of element //{" "}
      </p>
    </div>
  );
}

function TrafficCard({ alert }: { alert: Alert }) {
  return (
    <div className="data-grid">
      <article className="labels">
        <p>title</p>
        <p>description</p>
        <p>issued_at</p>
        <p>updated_at</p>
        <p>source_url</p>
        <p>planned</p>
        <p>is_major</p>
        <p>impacting_network</p>
        <p>delay</p>
        <p>start_date</p>
        <p>end_date</p>
        <p>is_active</p>
        <p>raw_payload</p>
      </article>
      <article className="data">
        <p>{alert.title ?? "N/A"}</p>
        <p>{alert.description ?? "N/A"}</p>
        <p>{alert.issued_at ?? "N/A"}</p>
        <p>{alert.updated_at ?? "N/A"}</p>
        <p>{alert.source_url ?? "N/A"}</p>
        <p>{alert.planned ?? "N/A"}</p>
        <p>{alert.is_major ?? "N/A"}</p>
        <p>{alert.impacting_network ?? "N/A"}</p>
        <p>{alert.delay ?? "N/A"}</p>
        <p>{alert.start_date ?? "N/A"}</p>
        <p>{alert.end_date ?? "N/A"}</p>
        <p>{alert.is_active ?? "N/A"}</p>
        <p>{alert.raw_payload ?? "N/A"}</p>
      </article>
      <p style={{ color: "red", fontWeight: "bold" }}>
        // This is the view for any other type of element //{" "}
      </p>
    </div>
  );
}
