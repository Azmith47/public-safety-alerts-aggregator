"use client";

import { AlertFilters } from "@/app/lib/definitions";
import { createContext, useState, type ReactNode } from "react";

interface FilterContextValue {
  filters: AlertFilters;
  updateFilters: (filters: AlertFilters) => void;
}

// 1. Create the context with an optional default value
export const FilterContext = createContext<FilterContextValue>({
  filters: {
    is_active: null,
    source_id: null,
  },
  updateFilters: () => {},
});

interface FilterProviderProps {
  children: ReactNode;
}

export function FilterProvider({ children }: FilterProviderProps) {
  //State variables
  const [filters, setFilters] = useState<AlertFilters>({
    is_active: null,
    source_id: null,
  });

  const updateFilters = (newFilters: AlertFilters) => {
    setFilters(newFilters);
  };

  // 2. Provide the state and modifier function to children
  return (
    <FilterContext.Provider value={{ filters, updateFilters }}>
      {children}
    </FilterContext.Provider>
  );
}
