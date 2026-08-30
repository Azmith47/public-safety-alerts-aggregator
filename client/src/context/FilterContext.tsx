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
    source_id: null,
    location_council_area: null,
    location_region: null,
  },
  updateFilters: () => {},
});

interface FilterProviderProps {
  children: ReactNode;
}

export function FilterProvider({ children }: FilterProviderProps) {
  //State variables
  const [filters, setFilters] = useState<AlertFilters>(() => {
    try {
      const savedFilters = localStorage.getItem('filters');
      if (savedFilters !== null) return JSON.parse(savedFilters)
      else return {
        is_active: null,
        source_id: null,
        location_council_area: null,
        location_region: null,
      };
    } catch (error) {
      console.error("Failed to parse storage:", error);
      return {
        is_active: null,
        source_id: null,
        location_council_area: null,
        location_region: null,
      }; // Fallback default
    }
  });

  const updateFilters = (newFilters: AlertFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    localStorage.setItem('filters', JSON.stringify(filters))
    recentSearches(filters)
  }, [filters])

  // 2. Provide the state and modifier function to children
  return (
    <FilterContext.Provider value={{ filters, updateFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

function recentSearches(filters: AlertFilters){
  const searches = localStorage.getItem('recent-searches');
  let filterCombos = []
  if(searches === null) {
    filterCombos.push(filters);
  } else {
    filterCombos = JSON.parse(searches);
    if(filterCombos.length > 10) filterCombos.shift();
    filterCombos.push(filters);
  }
  localStorage.setItem('recent-searches', JSON.stringify(filterCombos))
}
