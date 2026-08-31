"use client";

import { AlertFilters } from "@/app/lib/definitions";
import { createContext, useEffect, useState, type ReactNode } from "react";

interface FilterContextValue {
  filters: AlertFilters;
  updateFilters: (filters: AlertFilters) => void;
}

// 1. Create the context with an optional default value
export const FilterContext = createContext<FilterContextValue>({
  filters: {
    is_active: true,
    // source_id: null,
    category_id: null,
    location_council_area: null,
    location_region: null,
  },
  updateFilters: () => {},
});

interface FilterProviderProps {
  children: ReactNode;
}

export function FilterProvider({ children }: FilterProviderProps) {
  const defaultFilters: AlertFilters = {
    is_active: null,
    // source_id: null,
    category_id: null,
    location_council_area: null,
    location_region: null,
  };

  const [filters, setFilters] = useState<AlertFilters>(() => {
    if (typeof window === "undefined") {
      return defaultFilters;
    }

    try {
      const savedFilters = window.localStorage.getItem("filters");
      if (savedFilters !== null) {
        return JSON.parse(savedFilters) as AlertFilters;
      }
      return defaultFilters;
    } catch (error) {
      console.error("Failed to parse storage:", error);
      return defaultFilters;
    }
  });

  const updateFilters = (newFilters: AlertFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem("filters", JSON.stringify(filters));
    recentSearches(filters);
  }, [filters]);

  return (
    <FilterContext.Provider value={{ filters, updateFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

function recentSearches(filters: AlertFilters) {
  if (typeof window === "undefined") return;

  const searches = window.localStorage.getItem("recent-searches");
  let filterCombos: AlertFilters[] = [];

  if (searches === null) {
    filterCombos.push(filters);
  } else {
    try {
      filterCombos = JSON.parse(searches) as AlertFilters[];
    } catch {
      filterCombos = [];
    }

    if (filterCombos.length > 10) filterCombos.shift();
    filterCombos.push(filters);
  }

  window.localStorage.setItem("recent-searches", JSON.stringify(filterCombos));
}
