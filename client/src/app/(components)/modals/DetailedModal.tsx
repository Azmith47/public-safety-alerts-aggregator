"use client";

import { MenuContext } from "@/context/MenuContext";
import { AlertsContext } from "@/context/AlertsContext";
import { useContext } from "react";
import { Alert } from "@/app/lib/definitions";
import {
  convertDate,
  convertTime,
  formatDate,
  displayFormat,
} from "@/app/lib/utils";
import { table } from "console";

function TestCard({ alert }: { alert: Alert }) {
  return (
    <table>
      <tr>
        <td>Location:</td>
        <td>{alert.location_name}</td>
      </tr>
      <tr>
        <td>Postcode:</td>
        <td>{alert.location_postcode ?? "n/a"}</td>
      </tr>
      <tr>
        <td>Council Area:</td>
        <td>{displayFormat(alert.location_council_area) ?? "n/a"}</td>
      </tr>
      <tr>
        <td>Region:</td>
        <td>{displayFormat(alert.location_region) ?? "n/a"}</td>
      </tr>
      <tr>
        <td>Issued:</td>
        <td>{convertTime(alert.issued_at) ?? "n/a"}</td>
      </tr>
      <tr>
        <td>Last update:</td>
        <td>{convertTime(alert.updated_at) ?? "n/a"}</td>
      </tr>
      <tr>
        <td>Source:</td>
        <td>
          {alert.source_url ? (
            <a href={alert.source_url}>{alert.source_url}</a>
          ) : (
            "n/a"
          )}
        </td>
      </tr>
      <tr>
        <td>Planned:</td>
        <td>{alert.planned === true ? "True" : "False"}</td>
      </tr>
      <tr>
        <td>Is Major:</td>
        <td>{alert.is_major === true ? "True" : "False"}</td>
      </tr>
      <tr>
        <td>Network Impacted:</td>
        <td>{alert.impacting_network === true ? "True" : "False"}</td>
      </tr>
      <tr>
        <td>Delay:</td>
        <td>{alert.delay === true ? "True" : "False"}</td>
      </tr>
      <tr>
        <td>Start Date:</td>
        <td>
          <time dateTime={convertDate(alert.start_date) ?? ""}>
            {formatDate(alert.start_date) ?? "n/a"}
          </time>
        </td>
      </tr>
      <tr>
        <td>End Date:</td>
        <td>
          <time dateTime={convertDate(alert.end_date) ?? ""}>
            {formatDate(alert.end_date) ?? "n/a"}
          </time>
        </td>
      </tr>
    </table>
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
      <h4>{displayFormat(alert?.title)}</h4>
      <TestCard alert={alert} />
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
        <p>CURRENT ARRAY = {subscribedAlertTitles.join(" /// ")}</p>
      </div>
    </div>
  );
}
