"use client";

import { Alert } from '@/app/lib/definitions';
import { createContext, useState, type ReactNode } from 'react';

interface AlertsContextValue {
    alerts: Alert[];
    updateAlerts: (alerts: Alert[]) => void;
    selectedAlert: Alert | null;
    updateSelectedAlert: (alert: Alert | null) => void;
}

// 1. Create the context with an optional default value
export const AlertsContext = createContext<AlertsContextValue>({
  alerts: [],
  updateAlerts: () => {},
  selectedAlert: null,
  updateSelectedAlert: () => {},
});

interface AlertsProviderProps {
  children: ReactNode;
}

export function AlertsProvider({ children }: AlertsProviderProps) {
    //State variables
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

    const updateAlerts = (alerts: Alert[]) => {
        setAlerts(alerts);
    };

    const updateSelectedAlert = (alert: Alert | null) => {
        setSelectedAlert(alert);
    };

  // 2. Provide the state and modifier function to children
  return (
    <AlertsContext.Provider value={{ alerts, updateAlerts, selectedAlert, updateSelectedAlert }}>
      {children}
    </AlertsContext.Provider>
  );
}