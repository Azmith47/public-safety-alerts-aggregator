export const sourceName = "NSW RFS";
export const sourceWebsite = "https://www.rfs.nsw.gov.au";

export const run = async () => {
	const FEED_URL = "https://www.rfs.nsw.gov.au/feeds/majorIncidents.json";

	try {
		const response = await fetch(FEED_URL);

		if (!response.ok) {
			throw new Error(`RFS request failed with status ${response.status}`);
		}

		const data = await response.json();
		return Array.isArray(data?.features) ? data.features : [];
	} catch (err) {
		console.error("RFS Collector error:", err.message);
		return [];
	}
};

export default run;
