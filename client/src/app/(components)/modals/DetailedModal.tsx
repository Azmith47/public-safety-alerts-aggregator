"use client";

import { MenuContext } from "@/context/MenuContext";
import { AlertsContext } from "@/context/AlertsContext";
import { useContext } from "react";
import { convertTime } from "../AlertList";
import { Alert } from "@/app/lib/definitions";

function Firecard({ alert }: { alert: Alert }) {
  return (
    <div className="modal-grid">
      <article className="modal-label">
        {/* <p>description</p> */}
        <p>Location:</p>
        <p>Postcode:</p>
        <p>Council Area:</p>
        <p>Region:</p>
        <p>Issued:</p>
        <p>Last update:</p>
        <p>Source:</p>
        <p>Planned:</p>
        <p>Is Major:</p>
        <p>Network Impacted:</p>
        <p>Delay:</p>
        <p>Start Date:</p>
        <p>End Date:</p>
        {/* <p>raw_payload</p> */}
      </article>
      <article className="modal-data">
        {/* <p>{alert.description}</p> */}
        <p>{alert.location_name}</p>
        <p>{alert.location_postcode}</p>
        <p>{alert.location_council_area}</p>
        <p>{alert.location_region}</p>
        <p>{convertTime(alert.issued_at) ?? "n/a"}</p>
        <p>{convertTime(alert.updated_at) ?? "n/a"}</p>
        <p>
          {alert.source_url ? (
            <a href={alert.source_url}>{alert.source_url}</a>
          ) : (
            "n/a"
          )}
        </p>
        <p>{alert.planned === true ? "True" : "False"}</p>
        <p>{alert.is_major === true ? "True" : "False"}</p>
        <p>{alert.impacting_network === true ? "True" : "False"}</p>
        <p>{alert.delay === true ? "True" : "False"}</p>
        <p>{alert.start_date ?? "n/a"}</p>
        <p>{alert.end_date ?? "n/a"}</p>
        {/* <p>{alert.raw_payload}</p> */}
      </article>
      <p style={{ color: "red", fontWeight: "bold" }}>
        // Fire alert view // Source id: {alert.source_id} // category id:{" "}
        {alert.category_id}
      </p>
    </div>
  );
}

function TrafficCard({ alert }: { alert: Alert }) {
  return (
    <div className="modal-grid">
      <article className="modal-label">
        {/* <p>description</p> */}
        <p>Location:</p>
        <p>Postcode:</p>
        <p>Council Area:</p>
        <p>Region:</p>
        <p>Issued:</p>
        <p>Last update:</p>
        <p>Source:</p>
        <p>Planned:</p>
        <p>Is Major:</p>
        <p>Network Impacted:</p>
        <p>Delay:</p>
        <p>Start Date:</p>
        <p>End Date:</p>
      </article>
      <article className="modal-data">
        <p>{alert.location_name}</p>
        <p>{alert.location_postcode}</p>
        <p>{alert.location_council_area}</p>
        <p>{alert.location_region}</p>
        <p>{convertTime(alert.issued_at) ?? "n/a"}</p>
        <p>{convertTime(alert.updated_at) ?? "n/a"}</p>
        <p>
          {alert.source_url ? (
            <a href={alert.source_url}>{alert.source_url}</a>
          ) : (
            "n/a"
          )}
        </p>
        <p>{alert.planned ? "True" : "False"}</p>
        <p>{alert.is_major === true ? "True" : "False"}</p>
        <p>{alert.impacting_network === true ? "True" : "False"}</p>
        <p>{alert.delay === true ? "True" : "False"}</p>
        <p>{alert.start_date ?? "n/a"}</p>
        <p>{alert.end_date ?? "n/a"}</p>
      </article>
      <p style={{ color: "red", fontWeight: "bold" }}>
        // Any other type of alert // Source id: {alert.source_id} // category
        id: {alert.category_id}
      </p>
    </div>
  );
}

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
          <Firecard alert={alert} />
        </>
      )}
    </div>
  );
}
