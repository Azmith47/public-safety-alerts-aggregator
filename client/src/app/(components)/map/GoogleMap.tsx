"use client";

import { useEffect, useRef, useState, useContext } from "react";
import { Map, Polygon, useMap, Polyline } from "@vis.gl/react-google-maps";
import {
  BoundsType,
  PolygonType,
  PolylineType,
  MarkerType,
} from "../../lib/definitions";
import Markers from "./Markers";
import { AlertsContext } from "../../../context/AlertsContext";

export default function GoogleMap() {
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [polygons, setPolygons] = useState<PolygonType[]>([]);
  const [polylines, setPolylines] = useState<PolylineType[]>([]);
  const [bounds, setBounds] = useState<BoundsType | null>(null);
  const [mapCentre, setCentre] = useState({
    lat: -32.0,
    lng: 147.0,
  });

  const map = useMap();
  const boundsTimeout = useRef<NodeJS.Timeout | null>(null);
  const requestController = useRef<AbortController | null>(null);
  const { selectedAlert } = useContext(AlertsContext);

  useEffect(() => {
    if (selectedAlert !== null) {
      const marker = markers.find(
        (marker) => (marker.alertId = selectedAlert.id),
      );
      if (marker?.coordinates) {
        map?.panTo(marker?.coordinates);
        map?.setZoom(15);
      }
    }
  }, [selectedAlert]);

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
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/map/loadgeometry` +
          `?minLat=${bounds.south}` +
          `&maxLat=${bounds.north}` +
          `&minLng=${bounds.west}` +
          `&maxLng=${bounds.east}`;

        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Geometry request failed: ${response.status}`);
        }

        const data = await response.json();

        const newMarkers: MarkerType[] = [];
        const newPolygons: PolygonType[] = [];
        const newPolylines: PolylineType[] = [];

        for (const alert of data) {
          const { alertId, alertType, marker, polygon, polyline } = alert;

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
              paths: polygon.map(
                (point: { latitude: number; longitude: number }) => ({
                  lat: point.latitude,
                  lng: point.longitude,
                }),
              ),
            });
          }

          /*
           * Polyline
           */
          if (polyline?.length > 0) {
            newPolylines.push({
              alertId,
              alertType,
              paths: polyline.map(
                (point: { latitude: number; longitude: number }) => ({
                  lat: point.latitude,
                  lng: point.longitude,
                }),
              ),
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

  return (
    <Map
      defaultZoom={6}
      defaultCenter={mapCentre}
      mapId="2e7b007641215b0ed5b276ef"
      onBoundsChanged={handleBoundsChanged}
      onCameraChanged={(camera) => {
        setCentre(camera.detail.center);
      }}
    >
      <Markers markers={markers} map={map} />

      {polygons.map((polygon) => (
        <Polygon
          key={`polygon-${polygon.alertId}`}
          paths={polygon.paths}
          fillColor={polygon.alertType === 1 ? "red" : "yellow"}
          fillOpacity={0.5}
          strokeColor={polygon.alertType === 1 ? "red" : "yellow"}
          strokeOpacity={1}
          strokeWeight={2}
        />
      ))}

      {polylines.map((polyline) => (
        <Polyline
          key={`polyline-${polyline.alertId}`}
          path={polyline.paths}
          strokeColor="yellow"
          strokeOpacity={1}
          strokeWeight={5}
        />
      ))}
    </Map>
  );
}
