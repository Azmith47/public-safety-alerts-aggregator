"use client";

import { useContext } from "react";
import { MenuContext } from "@/context/MenuContext";
import { FilterContext } from "@/context/FilterContext";
import { AlertFilters, FilterKey } from "@/app/lib/definitions";

//Convert string to null | true |false
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
export function FilterTabs() {
  const selectedFilters: { key: FilterKey; label: string }[] = [];
  const { filters } = useContext(FilterContext)

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
    <div className="filter-bar">
      {selectedFilters.map((filter) => (
        <div className="filter-items" key={filter.key}>
          <span>{filter.label}</span>
        </div>
      ))}
    </div>
  );
}

// Filter component
// Fields need to be confirmed, everything below is placeholder
export default function FilterModal() {
  const { modalOpen, toggleMenu } = useContext(MenuContext);
  const isOpen = modalOpen === "filter";
  const onClose = () => toggleMenu(false, null);

  const { filters : localFilters, updateFilters : setLocalFilters } = useContext(FilterContext)
  
  const onApply = (newFilters : AlertFilters) => {
    setLocalFilters(newFilters);
    toggleMenu(false, null)
  }

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
            setLocalFilters({ ...localFilters, active: value });
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
            setLocalFilters({ ...localFilters, type: value });
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
