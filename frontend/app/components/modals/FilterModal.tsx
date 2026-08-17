import { AlertFilters, FilterModalProps } from "@/app/lib/definitions";
import { useState } from "react";
import {
  agencies,
  incidentTypes,
  regions,
  statuses,
} from "@/app/lib/placeholder-data";

//takes string and converts it to either null/true/false
function convertActiveToString(value: string): boolean | null {
  if (value === "") {
    return null;
  } else if (value === "true") {
    return true;
  }
  return false;
}

export default function FilterModal({
  initialFilters,
  onApply,
  isOpen,
  onClose,
}: FilterModalProps) {
  const [localFilters, setLocalFilters] =
    useState<AlertFilters>(initialFilters);

  return (
    <div
      className={isOpen ? "modal-container-visible" : "modal-container-hidden"}
    >
      <div className="modal-header">
        <button onClick={onClose}>✕</button>
      </div>
      <h4>Filter alerts:</h4>
      <form action="" className="modal-form">
        <label htmlFor="">Incident Status</label>
        <select
          value={
            localFilters.active === null
              ? ""
              : localFilters.active
                ? "true"
                : "false"
          }
          onChange={(e) => {
            const value = convertActiveToString(e.target.value);
            setLocalFilters((prev) => ({ ...prev, active: value }));
          }}
        >
          <option value="">-</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <label htmlFor="">Incident type</label>
        <select
          value={localFilters.type ?? ""}
          onChange={(e) => {
            const value = e.target.value === "" ? null : e.target.value;
            setLocalFilters((prev) => ({ ...prev, type: value }));
          }}
        >
          <option value="">-</option>
          <option value="traffic">Traffic</option>
          <option value="fire">Fire</option>
          <option value="storm">Storm</option>
          <option value="flood">Flood</option>
        </select>
        <button
          type="button"
          className="apply-btn"
          onClick={() => {
            onApply(localFilters);
          }}
        >
          Filter
        </button>
      </form>
    </div>
  );
}
