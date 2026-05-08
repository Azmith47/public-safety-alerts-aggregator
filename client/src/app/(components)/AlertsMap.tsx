"use client"

import { use } from 'react';
import { APIProvider, Map, Polygon, AdvancedMarker, Polyline, Pin } from "@vis.gl/react-google-maps"

type AlertProps = {
    apiKey: string;
    alertsProp: Promise<Alert[]>;
    trafficAlertsProp: Promise<TrafficAlert[]>;
}

type Alert = {
    title: string;
    markerPoint: { lat: number; lng: number };
    polygon?:  [{lat: number; lng: number}] []; // Optional polygon data
    link: string;
    pubDate: string;
    alertLevel: string;
    status: string;
    type: string;
    location: string;
    councilArea: string;
    size: number;
    fire: boolean;
    agency: string;
    lastUpdated: string;
    id: number;
}

type TrafficAlert = {
    title: string;
    markerPoint: { lat: number; lng: number };
    polyline?:  [{ levels: string; direction: string; coords: string }]; // Optional polyline data
    link: string;
    pubDate: Date;
    category: string;
    type: string;
    lastUpdated: Date;
    id: number;
    planned: boolean;
    startDate: Date;
    endDate: Date;
    ended: boolean;
    delay: number;
    headline: string;
    impactingNetwork: boolean;
    isMajor: boolean;
    queueLength: number;
    roads: object[];
    speedLimit: number;
    subCategory: string;
    otherLinks: object[];
    diversions: object;
    attendingGroups: string[];
    advice: string[];

}

function AlertMap({apiKey, alertsProp, trafficAlertsProp}:AlertProps) {
    const alerts = use(alertsProp);
    const trafficAlerts = use(trafficAlertsProp);

    return (
        <div className="map">
      <APIProvider apiKey={apiKey}>
        <Map width={'75vw'}
          defaultZoom={10}
          defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
          mapId={'2e7b007641215b0ed5b276ef '}
        >
          {
            alerts.map((alert) => (
              <div key={alert.id}>
                <AdvancedMarker position={alert.markerPoint} />
                {alert.polygon && <Polygon 
                  paths={alert.polygon} 
                  options={{ 
                    fillColor: 'red', 
                    fillOpacity: 0.5, 
                    strokeColor: 'red', 
                    strokeOpacity: 1, 
                    strokeWeight: 2 
                  }} 
                />}
              </div>
            ))
          }

          {
            trafficAlerts.map((alert) => (
              <div key={alert.id}>
                <AdvancedMarker position={alert.markerPoint}>
                  <Pin background={'#FFFF00'} glyphColor={'#000'} borderColor={'#000'} />
                </AdvancedMarker>
                {alert.polyline && <Polyline 
                  encodedPath={alert.polyline[0]?.coords} 
                  options={{
                    strokeColor: "#FF0000",
                    strokeWeight: 2 }} 
                />}
              </div>
            ))
          }
        </Map>
      </APIProvider>
    </div>
    )
}

export default AlertMap