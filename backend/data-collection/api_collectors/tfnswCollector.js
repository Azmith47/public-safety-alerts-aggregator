<<<<<<< Updated upstream
const { TrafficAlert } = require('../../models/alertClasses');
const { geoJsonToMarker } = require('../../utils/alertUtilities');

const sourceName = 'Transport NSW';
const sourceWebsite = 'https://www.livetraffic.com';

const run = async () => {
    const apiURLs = [
        'https://api.transport.nsw.gov.au/v1/live/hazards/incident/all',
        'https://api.transport.nsw.gov.au/v1/live/hazards/roadwork/all',
        'https://api.transport.nsw.gov.au/v1/live/hazards/alpine/all',
        'https://api.transport.nsw.gov.au/v1/live/hazards/fire/all',
        'https://api.transport.nsw.gov.au/v1/live/hazards/flood/all',
        'https://api.transport.nsw.gov.au/v1/live/hazards/majorevent/all'
    ];

    const apiKey = process.env.TFNSW_API_KEY;
    const alerts = [];

    if (!apiKey) {
        console.warn('TFNSW_API_KEY not set; skipping collector');
        return [];
    }

    try {
        for (const apiURL of apiURLs) {
            const response = await fetch(apiURL, {
                headers: {
                    'Authorization': `apikey ${apiKey}`
                }
            });
            const data = await response.json();

            data?.features.forEach(feature => {
                const title = feature?.properties?.displayName || 'No title';
                const id = feature?.id || null;
                const link = 'https://www.livetraffic.com/incident-details/' + id || 'No link';
                const pubDate = new Date(feature?.properties?.created) || null;

                const markerPointGeoJson = feature?.geometry || null;
                let markerPoint = null;

                const polyline = feature?.properties?.encodedPolylines || null;
                const lastUpdated = new Date(feature?.properties?.lastUpdated) || null;
                const category = feature?.properties?.mainCategory || 'No category';

                const plannedString = feature?.properties?.incidentKind || null;
                const planned = plannedString === 'Planned' ? true : false;

                const startDate = new Date(feature?.properties?.start) || null;
                const endDate = new Date(feature?.properties?.end) || null;
                const ended = feature?.properties?.ended || false;
                const delay = feature?.properties?.delay || 0;
                const headline = feature?.properties?.headline || null;
                const impactingNetwork = feature?.properties?.impactingNetwork || false;
                const isMajor = feature?.properties?.isMajor || false;
                const queueLength = feature?.properties?.queueLength || 0;
                const roads = feature?.properties?.roads || null;
                const speedLimit = feature?.properties?.speedLimit || 0;
                const subCategory = feature?.properties?.subCategoryA || null;
                const otherLinks = feature?.properties?.webLinks || null;
                const diversions = feature?.properties?.diversions || null;
                const attendingGroups = feature?.properties?.attendingGroups || null;

                const adviceA = feature?.properties?.adviceA || null;
                const adviceB = feature?.properties?.adviceB || null;
                const adviceC = feature?.properties?.adviceC || null;
                const advice = [adviceA, adviceB, adviceC];

                if (markerPointGeoJson != null) {
                    markerPoint = geoJsonToMarker(markerPointGeoJson);
                }

                const alert = new TrafficAlert(title, id, link, pubDate, markerPoint, polyline, lastUpdated, category, planned, startDate, endDate, ended, delay, headline, impactingNetwork, isMajor, queueLength, roads, speedLimit, subCategory, otherLinks, diversions, attendingGroups, advice);
                alerts.push(alert);
            });
        }
        return alerts;
    } catch (err) {
        console.error('TFNSW Collector error:', err.message);
        return [];
    }
};

module.exports = { run, sourceName, sourceWebsite };
=======
export const sourceName = "Transport NSW";
export const sourceWebsite = "https://www.livetraffic.com";

export const apiURLs = [
	process.env.TFNSW_API_URL_INCIDENTS,
	process.env.TFNSW_API_URL_ROADWORK,
	process.env.TFNSW_API_URL_ALPINE,
	process.env.TFNSW_API_URL_FIRE,
	process.env.TFNSW_API_URL_FLOOD,
	process.env.TFNSW_API_URL_MAJOR_EVENT,
];

export const run = async () => {
	const apiKey = process.env.TFNSW_API_KEY;
	const alerts = [];

	if (!apiKey) {
		console.warn("TFNSW_API_KEY not set; skipping collector");
		return [];
	}

	try {
		for (const apiURL of apiURLs) {
			const response = await fetch(apiURL, {
				headers: {
					Authorization: `apikey ${apiKey}`,
					Accept: "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(
					`TFNSW request failed with status ${response.status}`,
				);
			}

			const data = await response.json();
			alerts.push(
				...(Array.isArray(data?.features) ? data.features : []),
			);
		}

		return alerts;
	} catch (err) {
		console.error("TFNSW Collector error:", err.message);
		return [];
	}
};

export default run;
>>>>>>> Stashed changes
