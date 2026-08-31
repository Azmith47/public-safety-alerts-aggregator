"use client";

import { useContext, useEffect, useState } from "react";
import { MenuContext } from "@/context/MenuContext";
import { FilterContext } from "@/context/FilterContext";
import { AlertFilters, FilterKey } from "@/app/lib/definitions";
import { lgaGroups, regions } from "@/app/lib/placeholder-data";
import { convertActiveToString, removeFormatting } from "@/app/lib/utils";

export function FilterTabs() {
  const selectedFilters: { key: FilterKey; label: string }[] = [];
  const { filters } = useContext(FilterContext);

  const incidentTypeLabels: Record<number, string> = {
    1: "Fire",
    2: "Traffic Incident",
    3: "Road Hazard",
    4: "Flood",
    5: "Storm",
    6: "Weather",
    7: "Hazmat",
    8: "Rescue",
    9: "Medical",
    10: "Planned Burn",
    11: "Public Event",
    12: "Other",
  };

  if (filters.is_active !== null) {
    selectedFilters.push({
      key: "is_active",
      label: filters.is_active ? "Active" : "Inactive",
    });
  }

  if (filters.category_id !== null) {
    selectedFilters.push({
      key: "category_id",
      label: incidentTypeLabels[filters.category_id] ?? "Unknown",
    });
  }

  if (filters.location_council_area !== null) {
    selectedFilters.push({
      key: "location_council_area",
      label: filters.location_council_area ?? "Unknown",
    });
  }

  if (filters.location_region !== null) {
    selectedFilters.push({
      key: "location_region",
      label: filters.location_region ?? "Unknown",
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

  //Reset object to set each filter back to null
  const emptyFilters: AlertFilters = {
    is_active: null,
    category_id: null,
    location_region: null,
    location_council_area: null,
  };

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
          value={localFilters.category_id ?? ""}
          onChange={(e) => {
            const value = e.target.value === "" ? null : Number(e.target.value);
            setLocalFilters({ ...localFilters, category_id: value });
          }}
        >
          <option value="">Select Incident Type</option>
          <option value="1">Fire</option>
          <option value="2">Traffic Incident</option>
          <option value="3">Road Hazard</option>
          <option value="4">Flood</option>
          <option value="5">Storm</option>
          <option value="6">Weather</option>
          <option value="7">Hazmat</option>
          <option value="8">Rescue</option>
          <option value="9">Medical</option>
          <option value="10">Planned Burn</option>
          <option value="11">Public Event</option>
          <option value="12">Other</option>
        </select>
        <label htmlFor="">Region</label>
        <select
          value={localFilters.location_region ?? ""}
          onChange={(e) => {
            const value = e.target.value === "" ? null : e.target.value;
            setLocalFilters({ ...localFilters, location_region: value });
          }}
        >
          <option value="">Select Region</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        <label htmlFor="">LGA</label>
        <select
          value={localFilters.location_council_area ?? ""}
          onChange={(e) => {
            const value = e.target.value === "" ? null : e.target.value;
            setLocalFilters({ ...localFilters, location_council_area: value });
          }}
        >
          <option value="">Select LGA</option>
          {Object.entries(lgaGroups).map(([region, lgas]) => (
            <optgroup key={region} label={region} className="optgroup-label">
              {[...lgas]
                .sort((a, b) => a.localeCompare(b))
                .map((lga) => (
                  <option key={lga} value={lga}>
                    {lga}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
        <div className="filter-btn-container">
          <button
            type="button"
            className="apply-btn"
            onClick={() => {
              onApply(localFilters);
            }}
          >
            Apply Filters
          </button>
          <button
            type="button"
            className="reset-btn"
            onClick={() => {
              onApply(emptyFilters);
            }}
          >
            Reset Filters
          </button>
        </div>
      </form>
    </div>
  );
}
