"use client";

import { useContext, useEffect, useState } from "react";
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

export function FilterTabs() {
  const selectedFilters: { key: FilterKey; label: string }[] = [];
  const { filters } = useContext(FilterContext);

  const typeLabels: Record<number, string> = {
    1: "Fire",
    2: "Traffic",
    4: "Flood",
    5: "Storm",
  };

  if (filters.is_active !== null) {
    selectedFilters.push({
      key: "is_active",
      label: filters.is_active ? "Active" : "Inactive",
    });
  }

  if (filters.type !== null) {
    selectedFilters.push({
      key: "type",
      label: typeLabels[filters.type] ?? "Unknown",
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

// Filter component
// Fields need to be confirmed, everything below is placeholder
export default function FilterModal() {
  const { modalOpen, toggleMenu } = useContext(MenuContext);
  const isOpen = modalOpen === "filter";
  const onClose = () => toggleMenu(false, null);

  const { filters, updateFilters } = useContext(FilterContext);
  const [localFilters, setLocalFilters] = useState<AlertFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const onApply = (newFilters: AlertFilters) => {
    updateFilters(newFilters);
    toggleMenu(false, null);
  };

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
            localFilters.is_active === null
              ? ""
              : localFilters.is_active
                ? "true"
                : "false"
          }
          onChange={(e) => {
            const value = convertActiveToString(e.target.value);
            setLocalFilters({ ...localFilters, is_active: value });
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
            const value = e.target.value === "" ? null : Number(e.target.value);
            setLocalFilters({ ...localFilters, type: value });
          }}
        >
          <option value="">-</option>
          <option value="1">Fire</option>
          <option value="2">Traffic</option>
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
