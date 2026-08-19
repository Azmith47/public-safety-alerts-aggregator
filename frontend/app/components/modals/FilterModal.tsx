import {
  AlertFilters,
  FilterKey,
  FilterModalProps,
} from "@/app/lib/definitions";
import { useState } from "react";

//Conver string to null | true |false
function convertActiveToString(value: string): boolean | null {
  if (value === "") {
    return null;
  } else if (value === "true") {
    return true;
  }
  return false;
}

//TODO: This is too repetitive as number of filters increases
//Replace "if" block with Object.entries(filters)
//For labels use a simple object as a lookup table
export function FilterTabs({ filters }: { filters: AlertFilters }) {
  const selectedFilters: { key: FilterKey; label: string }[] = [];

  if (filters.active !== null) {
    selectedFilters.push({
      key: "active",
      label: filters.active ? "Active" : "Inactive",
    });
  }

  if (filters.type !== null) {
    selectedFilters.push({
      key: "type",
      label: filters.type,
    });
  }
  return (
    <div className={selectedFilters.length > 0 ? "filter-bar" : ""}>
      {selectedFilters.map((filter) => (
        <div className="filter-items" key={filter.key}>
          <span>{filter.label}</span>
        </div>
      ))}
    </div>
  );
}

//TODO: Options are hardcoded (won't scale)
//Loop over an array of options
//Use .map() to generate <option> tags
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
