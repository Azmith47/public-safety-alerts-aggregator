"use client";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

export default function GoogleMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
  console.log("API key:", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

  // Coordinates for NSW
  const NSW_CENTER = { lat: -32.0, lng: 147.0 };

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        style={{ width: "100%", height: "100%" }}
        defaultCenter={NSW_CENTER}
        defaultZoom={7}
      />
    </APIProvider>
  );
}
