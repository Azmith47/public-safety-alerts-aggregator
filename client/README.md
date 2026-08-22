# Frontend

This folder contains the web interface for the Public Safety Alerts Aggregator & Explorer.

The frontend dashboard will allow users to:

- View current public safety alerts
- Search alerts
- Filter alerts by region or category
- Optionally view alerts on a map

Possible technologies:
- React
- HTML/CSS/JavaScript
- Leaflet for map visualisation

## Local development

Start the backend on port 5000, then run the client with `npm run dev`.
The client uses `NEXT_PUBLIC_API_URL` for API requests. Google Maps is optional;
set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` only when the key belongs to a project with
Maps JavaScript API billing enabled.