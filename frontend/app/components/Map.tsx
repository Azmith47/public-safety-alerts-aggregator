"use client";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { title } from "process";

export default function GoogleMap() {
  // console.log("API key:", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

  //Centres map on NSW after page reload/refresh
  const NSW_CENTER = { lat: -32.0, lng: 147.0 };

  //Placeholder locations
  const placeholderLocations = [
    { id: 1, name: "Dubbo", lat: -32.24295, lng: 148.6 },
    { id: 2, name: "Griffith", lat: -34.28853, lng: 146.05093 },
    { id: 3, name: "Sydney", lat: -33.865143, lng: 151.2099 },
  ];

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        style={{ width: "100%", height: "100%" }}
        defaultCenter={NSW_CENTER}
        defaultZoom={7}
        // mapId="" - NEEDED FOR ADVANCED MARKERS
      >
        {placeholderLocations.map((location) => (
          <Marker
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            title={location.name}
            onClick={() => alert(location.name)}
          />
        ))}
      </Map>
    </APIProvider>
  );
}

//API key stored in gitignore
