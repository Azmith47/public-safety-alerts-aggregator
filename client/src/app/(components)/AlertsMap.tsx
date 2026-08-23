"use client";

import { useEffect, useRef, useState } from "react";
import {
  APIProvider,
  Map,
  Polygon,
  AdvancedMarker,
  useMap,
  Polyline,
  Pin,
} from "@vis.gl/react-google-maps";

type Marker = {
  alertId: number;
  alertType: number;
  coordinates: {
    lat: number;
    lng: number;
  };
};

type Polygon = {
  alertId: number;
  alertType: number;
  paths: {
    lat: number;
    lng: number;
  }[];
};

type Polyline = {
  alertId: number;
  alertType: number;
  encodedPath: string;
};

type Bounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};

function GoogleMap() {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const [polylines, setPolylines] = useState<Polyline[]>([]);
  const [bounds, setBounds] = useState<Bounds | null>(null);

  const map = useMap();
  const boundsTimeout = useRef<NodeJS.Timeout | null>(null);
  const requestController = useRef<AbortController | null>(null);

  const NSW_CENTER = {
    lat: -32.0,
    lng: 147.0,
  };

  /*
   * Fetch geometry whenever the bounds settle.
   */
  useEffect(() => {
    if (!bounds) return;

    // Cancel the previous request
    requestController.current?.abort();

    const controller = new AbortController();
    requestController.current = controller;

    const loadGeometry = async () => {
      try {
        const url =
          `http://localhost:3001/map/loadgeometry` +
          `?minLat=${bounds.south}` +
          `&maxLat=${bounds.north}` +
          `&minLng=${bounds.west}` +
          `&maxLng=${bounds.east}`;


        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Geometry request failed: ${response.status}`
          );
        }

        const data = await response.json();

        const newMarkers: Marker[] = [];
        const newPolygons: Polygon[] = [];
        const newPolylines: Polyline[] = [];

        for (const alert of data) {
          const {
            alertId,
            alertType,
            marker,
            polygon,
            polyline,
          } = alert;

          /*
           * Marker
           */
          if (marker?.length > 0) {
            newMarkers.push({
              alertId,
              alertType,
              coordinates: {
                lat: marker[0].latitude,
                lng: marker[0].longitude,
              },
            });
          }

          /*
           * Polygon
           */
          if (polygon?.length > 0) {
            newPolygons.push({
              alertId,
              alertType,
              paths: polygon.map((point: { latitude: number; longitude: number }) => ({
                lat: point.latitude,
                lng: point.longitude,
              })),
            });
          }

          /*
           * Polyline
           */
          if (polyline?.length > 0) {
            newPolylines.push({
              alertId,
              alertType,
              encodedPath: polyline,
            });
          }
        }

        /*
         * REPLACE the existing geometry.
         *
         * Do NOT append using:
         *
         * setMarkers(prev => [...prev, ...newMarkers])
         *
         * because that causes duplicates every time
         * the map moves.
         */
        setMarkers(newMarkers);
        setPolygons(newPolygons);
        setPolylines(newPolylines);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        /*
         * AbortError is expected when the user moves
         * the map before the previous request finishes.
         */
        if (error.name === "AbortError") {
          return;
        }

        console.error("Failed to load map geometry:", error);
      }
    };

    loadGeometry();

    return () => {
      controller.abort();
    };
  }, [bounds]);

  /*
   * Handle map movement.
   *
   * Debounce this because Google Maps can fire
   * onBoundsChanged many times during a pan/zoom.
   */
  const handleBoundsChanged = () => {
    if (!map) return;

    if (boundsTimeout.current) {
      clearTimeout(boundsTimeout.current);
    }

    boundsTimeout.current = setTimeout(() => {
      const newBounds = map.getBounds();

      if (!newBounds) return;

      const northEast = newBounds.getNorthEast();
      const southWest = newBounds.getSouthWest();

      setBounds({
        north: northEast.lat(),
        south: southWest.lat(),
        east: northEast.lng(),
        west: southWest.lng(),
      });
    }, 300);
  };

  const handleMarkerClick = (alertId: number) => {
    console.log(alertId)
  };

  return (
    <Map
      height="75vh"
      width="75vw"
      defaultZoom={6}
      defaultCenter={NSW_CENTER}
      mapId="2e7b007641215b0ed5b276ef"
      onBoundsChanged={handleBoundsChanged}
    >
      {markers.map((marker) => (
        <AdvancedMarker
          key={`marker-${marker.alertId}`}
          position={marker.coordinates}
          onClick={() => handleMarkerClick(marker.alertId)}
        >
          <Pin
            background= {marker.alertType === 1 ? "red" : "yellow"}
            borderColor="black"
            glyphColor="white"
          />
        </AdvancedMarker>
      ))}

      {polygons.map((polygon) => (
        <Polygon
          key={`polygon-${polygon.alertId}`}
          paths={polygon.paths}
          options={{
            fillColor: polygon.alertType === 1 ? "red" : "yellow",
            fillOpacity: 0.5,
            strokeColor: polygon.alertType === 1 ? "red" : "yellow",
            strokeOpacity: 1,
            strokeWeight: 2,
          }}
        />
      ))}

      {polylines.map((polyline) => (
        <Polyline
          key={`polyline-${polyline.alertId}`}
          path={polyline.encodedPath}
          options={{
            strokeColor: "blue",
            strokeOpacity: 1,
            strokeWeight: 2,
          }}
        />
      ))}
    </Map>
  );
}

function AlertMap({ apiKey }: { apiKey: string }) {
  return (
    <APIProvider apiKey={apiKey}>
      <GoogleMap />
    </APIProvider>
  );
}

export default AlertMap;