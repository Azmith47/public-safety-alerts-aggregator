"use client";

import { MenuContext } from "@/context/MenuContext";
import { AlertsContext } from "@/context/AlertsContext";
import { useContext } from "react";
import { Alert } from "@/app/lib/definitions";
import {
  convertDate,
  convertTime,
  formatDate,
  removeFormatting,
} from "@/app/lib/utils";

function Firecard({ alert }: { alert: Alert }) {
  return (
    <div className="modal-grid">
      <article className="modal-label">
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
        <p>{alert.location_postcode ?? "n/a"}</p>
        <p>{removeFormatting(alert.location_council_area) ?? "n/a"}</p>
        <p>{removeFormatting(alert.location_region) ?? "n/a"}</p>
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
        <time dateTime={convertDate(alert.start_date) ?? ""}>
          {formatDate(alert.start_date) ?? "n/a"}
        </time>
        <br />
        <br />
        <time dateTime={convertDate(alert.end_date) ?? ""}>
          {formatDate(alert.end_date) ?? "n/a"}
        </time>
      </article>
      <p>
        Alert category: {alert.category_id} // Alert source: {alert.source_id}{" "}
        {alert.source_id === 1
          ? "This should be a fire alert"
          : "This should be a traffic alert"}
      </p>
    </div>
  );
}

function TrafficCard({ alert }: { alert: Alert }) {
  return (
    <div className="modal-grid">
      <article className="modal-label">
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
        <p>{alert.location_name ?? "n/a"}</p>
        <p>{alert.location_postcode ?? "n/a"}</p>
        <p>{removeFormatting(alert.location_council_area) ?? "n/a"}</p>
        <p>{removeFormatting(alert.location_region) ?? "n/a"}</p>
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
        <time dateTime={convertDate(alert.start_date) ?? ""}>
          {formatDate(alert.start_date) ?? "n/a"}
        </time>
        <br />
        <br />
        <time dateTime={convertDate(alert.end_date) ?? ""}>
          {formatDate(alert.end_date) ?? "n/a"}
        </time>
      </article>
      <p>
        Alert category: {alert.category_id} // Alert source: {alert.source_id}{" "}
        //{" "}
        {alert.source_id === 1
          ? "This should be a fire alert"
          : "This should be a traffic alert"}
      </p>
    </div>
  );
}

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
      <h4>{removeFormatting(alert?.title)}</h4>
      {alert?.source_id === 2 ? (
        <TrafficCard alert={alert} />
      ) : (
        <>
          <Firecard alert={alert} />
        </>
      )}
      <div className="subscribe-section">
        <p>Click to subscribe</p>
        <input
          type="checkbox"
          //Re-render checkbox if title is in subscribedAlertTitles array
          //Otherwise checkbox stays clicked for every alert
          checked={subscribedAlertTitles.includes(alert.title)}
          //Click checkbox => if title is in subscribedAlertTitles array remove it, otherwise add it
          onChange={() =>
            subscribedAlertTitles.includes(alert.title)
              ? removeSubscribedAlert(alert.title)
              : addSubscribedAlert(alert.title)
          }
        />
        <p>CURRENT ARRAY = {subscribedAlertTitles.join(" /// ")}</p>
      </div>
    </div>
  );
}
