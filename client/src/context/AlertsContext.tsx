"use client";

import { Alert } from '@/app/lib/definitions';
import { createContext, useState, type ReactNode } from 'react';

interface AlertsContextValue {
    alerts: Alert[];
    updateAlerts: (alerts: Alert[]) => void;
    selectedAlert: Alert | null;
    updateSelectedAlert: (alert: Alert | null) => void;
    selectedMarker: Alert | null;
    updateSelectedMarker: (alert: Alert | null) => void;

}

// 1. Create the context with an optional default value
export const AlertsContext = createContext<AlertsContextValue>({
  alerts: [],
  updateAlerts: () => {},
  selectedAlert: null,
  updateSelectedAlert: () => {},
  selectedMarker: null,
  updateSelectedMarker: () => {}
});

interface AlertsProviderProps {
  children: ReactNode;
}

export function AlertsProvider({ children }: AlertsProviderProps) {
    //State variables
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<Alert | null>(null);

    const updateAlerts = (alerts: Alert[]) => {
        setAlerts(alerts);
    };

    const updateSelectedAlert = (alert: Alert | null) => {
        setSelectedAlert(alert);
    };

    const updateSelectedMarker = (alert: Alert | null) => {
        setSelectedMarker(alert);
    };

  // 2. Provide the state and modifier function to children
  return (
    <AlertsContext.Provider value={{ alerts, updateAlerts, selectedAlert, updateSelectedAlert, selectedMarker, updateSelectedMarker }}>
      {children}
    </AlertsContext.Provider>
  );
}