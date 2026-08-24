"use client"

import { APIProvider } from "@vis.gl/react-google-maps";
import GoogleMap from "./GoogleMap"

function AlertMap({ apiKey }: { apiKey: string }) {
  return (
    <APIProvider apiKey={apiKey}>
      <GoogleMap />
    </APIProvider>
  );
}

export default AlertMap;