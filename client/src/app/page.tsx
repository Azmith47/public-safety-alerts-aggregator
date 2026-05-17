import { Suspense } from "react";
import AlertMap from "./(components)/AlertsMap";

async function fetchAlerts() {
  try {
    const response = await fetch('http://localhost:3001/alerts');
    if (response.ok) {
      const data = await response.json();
      return(data);
    } else {
      console.error('Failed to fetch alerts:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching alerts:', error);
  }
}

async function fetchTrafficAlerts() {
  try {
    const response = await fetch('http://localhost:3001/alerts/traffic');
    if (response.ok) {
      const data = await response.json();
      return(data);
    } else {
      console.error('Failed to fetch alerts:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching alerts:', error);
  }
}

export default function Home() {
  const alerts = fetchAlerts();
  const trafficAlerts = fetchTrafficAlerts();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AlertMap apiKey={process.env.GOOGLE_MAPS_API_KEY || ''} alertsProp={alerts} trafficAlertsProp={trafficAlerts} />
    </Suspense>
  );
}