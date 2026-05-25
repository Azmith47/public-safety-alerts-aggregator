import { FireAlert } from '../../models/alertClasses.js';
import { geoJsonToPaths, geoJsonToMarker, splitDescription, parsePubDate } from '../../utils/alertUtilities.js';

export const sourceName = 'NSW RFS';
export const sourceWebsite = 'https://www.rfs.nsw.gov.au';

export const run = async () => {
    const feedURL = 'https://www.rfs.nsw.gov.au/feeds/majorIncidents.json';
    try {
        const response = await fetch(feedURL);
        const data = await response.json();
        const alerts = [];

        data?.features.forEach(feature => {
            const title = feature?.properties?.title || 'No title';
            const description = feature?.properties?.description || 'No description';
            const link = feature?.properties?.link || 'No link';
            const pubDate = parsePubDate(feature?.properties?.pubDate) || 'No publication date';
            const alertLevel = feature?.properties?.category || 'No alert level';
            const guuid = feature?.properties?.guid || null;
            let id = null;
            let markerPoint = null;
            let polygon = null;

            const splitGuuid = guuid.split('/');
            id = splitGuuid[6] || null;

            const markerPointGeoJson = feature?.geometry?.geometries?.[0] || feature?.geometry || null;
            const polygonGeoJson = feature?.geometry?.geometries?.[1]?.geometries?.[0] || null;

            if (markerPointGeoJson != null) {
                markerPoint = geoJsonToMarker(markerPointGeoJson);
            }

            if (polygonGeoJson != null) {
                polygon = geoJsonToPaths(polygonGeoJson);
            }

            let { location, councilArea, size, fire, agency, lastUpdated, status, category } = splitDescription(description);

            lastUpdated = new Date(lastUpdated);

            const alert = new FireAlert(title, link, pubDate, alertLevel, status, markerPoint, polygon, category, location, councilArea, size, fire, agency, lastUpdated, id);
            alerts.push(alert);
        });

        return alerts;
    } catch (err) {
        console.error('RFS Collector error:', err.message);
        return [];
    }
};

export default run;
