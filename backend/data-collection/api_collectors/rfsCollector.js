import { FireAlert } from "../../models/alertClasses.js";
import {
	geoJsonToPaths,
	geoJsonToMarker,
	splitDescription,
	parsePubDate,
} from "../../utils/alertUtilities.js";
import CategoryDAO from "../../database/CategoryDAO.js";

export const sourceName = "NSW RFS";
export const sourceWebsite = "https://www.rfs.nsw.gov.au";

const categoryCache = await CategoryDAO.getAll().then((categories) => {
	const cache = new Map();
	categories.forEach((cat) => cache.set(cat.name.toLowerCase(), cat.id));
	return cache;
});

export const run = async () => {
	const FEED_URL = "https://www.rfs.nsw.gov.au/feeds/majorIncidents.json";
	try {
		const response = await fetch(FEED_URL);
		const data = await response.json();
		return data || [];
	} catch (err) {
		console.error("RFS Collector error:", err.message);
		return [];
	}
};

export default run;
