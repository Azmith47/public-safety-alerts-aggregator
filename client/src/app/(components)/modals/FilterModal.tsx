"use client";

import { useContext, useEffect, useState } from "react";
import { MenuContext } from "@/context/MenuContext";
import { FilterContext } from "@/context/FilterContext";
import { AlertFilters, FilterKey } from "@/app/lib/definitions";
import { allLgas } from "@/app/lib/placeholder-data";
import { convertActiveToString, removeFormatting } from "@/app/lib/utils";

export function FilterTabs() {
  const selectedFilters: { key: FilterKey; label: string }[] = [];
  const { filters } = useContext(FilterContext);

  const typeLabels: Record<number, string> = {
    1: "Fire",
    2: "Traffic",
  };

  if (filters.is_active !== null) {
    selectedFilters.push({
      key: "is_active",
      label: filters.is_active ? "Active" : "Inactive",
    });
  }

  if (filters.source_id !== null) {
    selectedFilters.push({
      key: "source_id",
      label: typeLabels[filters.source_id] ?? "Unknown",
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
          <option value="">Select Incident status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <label htmlFor="">Incident type</label>
        <select
          value={localFilters.source_id ?? ""}
          onChange={(e) => {
            const value = e.target.value === "" ? null : Number(e.target.value);
            setLocalFilters({ ...localFilters, source_id: value });
          }}
        >
          <option value="">Select Incident Type</option>
          <option value="1">Fire</option>
          <option value="2">Traffic</option>
        </select>
        {/* testing lgas */}
        <label htmlFor="">LGA</label>
        <select
          value={localFilters.location_council_area ?? ""}
          onChange={(e) => {
            const value = e.target.value === "" ? null : e.target.value;
            setLocalFilters({ ...localFilters, location_council_area: value });
          }}
        >
          <option value="">Select LGA</option>
          {allLgas.map((lga) => (
            <option key={lga} value={lga}>
              {lga}
            </option>
          ))}
        </select>
        {/*  */}
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
