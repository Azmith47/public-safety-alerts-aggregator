"use client";
import { useContext } from "react";
import { MenuContext } from "@/context/MenuContext";
import { AlertsContext } from "@/context/AlertsContext";
import { Alert } from "../lib/definitions";
import { convertTime, displayFormat } from "../lib/utils";
import Image from "next/image";

//Fire = 1,7,10
//Traffic = 2,3
//Flood = 4
//Public event = 11
//Other = 12
//5,6,8,9 have no entries in the db
function getIcon(category_id: number) {
  if (
    Number(category_id) === 1 ||
    Number(category_id) === 7 ||
    Number(category_id) === 10
  )
    return (
      <Image
        className="icon"
        src="\icons\fire.svg"
        alt="fire icon"
        width={0}
        height={0}
      />
    );
  if (Number(category_id) === 2 || Number(category_id) === 3)
    return (
      <Image
        className="icon"
        src="\icons\traffic.svg"
        alt="traffic icon"
        width={10}
        height={10}
      />
    );
  if (Number(category_id) === 4) {
    return (
      <Image
        className="icon"
        src="\icons\flood.svg"
        alt="other alert icon"
        width={10}
        height={10}
      />
    );
  }
  if (Number(category_id) === 11 || Number(category_id) === 12) {
    return (
      <Image
        className="icon"
        src="\icons\OTHER.svg"
        alt="other alert icon"
        width={10}
        height={10}
      />
    );
  } else
    return (
      <Image
        className="icon"
        src="\icons\kek.svg"
        alt="other alert icon"
        width={10}
        height={10}
      />
    );
}

export default function AlertCard({ alert }: { alert: Alert }) {
  const { toggleMenu } = useContext(MenuContext);
  const { selectedAlert, updateSelectedAlert } = useContext(AlertsContext);

  function onAlertClick(alert: Alert) {
    toggleMenu(false, "detailedModal");
    updateSelectedAlert(alert);
  }

  return (
    <article
      className={alert.is_active ? "alert-card-active" : "alert-card-inactive"}
      onClick={() => onAlertClick(alert)}
    >
      <div className="alert-card-top">
        <span className={alert.is_active ? "dot-active" : "dot-inactive"}>
          {alert.is_active ? "Active" : "Inactive"}
        </span>
        <p>
          <strong>Issued:</strong> {convertTime(alert.issued_at)}
        </p>
      </div>
      <div className="alert-card-middle">
        <p>{getIcon(alert.category_id)}</p>
        <p>{displayFormat(alert.title)}</p>
      </div>
      <div className="alert-card-bottom">
        <p>{displayFormat(alert.location_council_area)}</p>
      </div>
    </article>
  );
}
