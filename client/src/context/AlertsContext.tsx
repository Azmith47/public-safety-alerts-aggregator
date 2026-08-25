"use client";

import { Alert } from "@/app/lib/definitions";
import { createContext, useState, type ReactNode } from "react";

interface AlertsContextValue {
  alerts: Alert[];
  updateAlerts: (alerts: Alert[]) => void;
  selectedAlert: Alert | null;
  updateSelectedAlert: (alert: Alert | null) => void;
  //testing alert subscription
  subscribedAlertTitles: string[];
  addSubscribedAlert: (title: string) => void;
  removeSubscribedAlert: (title: string) => void;
  selectedMarker: Alert | null;
  updateSelectedMarker: (alert: Alert | null) => void;
}

// 1. Create the context with an optional default value
export const AlertsContext = createContext<AlertsContextValue>({
  alerts: [],
  updateAlerts: () => {},
  selectedAlert: null,
  updateSelectedAlert: () => {},
  //default value for alert subscription
  subscribedAlertTitles: [],
  addSubscribedAlert: () => {},
  removeSubscribedAlert: () => {},
  selectedMarker: null,
  updateSelectedMarker: () => {},
});

interface AlertsProviderProps {
  children: ReactNode;
}

export function AlertsProvider({ children }: AlertsProviderProps) {
  //State variables
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Alert | null>(null);
  //Subscription state
  const [subscribedAlertTitles, setSubscribedTitles] = useState<string[]>([]);

  const updateAlerts = (alerts: Alert[]) => {
    setAlerts(alerts);
  };

  const updateSelectedAlert = (alert: Alert | null) => {
    setSelectedAlert(alert);
  };

  //subscription functions
  const addSubscribedAlert = (title: string) => {
    setSubscribedTitles((prev) => [...prev, title]);
  };

  const removeSubscribedAlert = (title: string) => {
    setSubscribedTitles((prev) => prev.filter((t) => t !== title));
  };

  const updateSelectedMarker = (alert: Alert | null) => {
    setSelectedMarker(alert);
  };

  // 2. Provide the state and modifier function to children
  return (
    <AlertsContext.Provider
      value={{
        alerts,
        updateAlerts,
        selectedAlert,
        updateSelectedAlert,
        subscribedAlertTitles,
        addSubscribedAlert,
        removeSubscribedAlert,
        selectedMarker,
        updateSelectedMarker,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
}
