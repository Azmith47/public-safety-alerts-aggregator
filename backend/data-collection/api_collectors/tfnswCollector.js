export const sourceName = "Transport NSW";
export const sourceWebsite = "https://www.livetraffic.com";

export const apiURLs = [
	process.env.TFNSW_API_URL_INCIDENTS ||
		"https://api.transport.nsw.gov.au/v1/live/hazards/incident/open",
	process.env.TFNSW_API_URL_ROADWORK ||
		"https://api.transport.nsw.gov.au/v1/live/hazards/roadwork/open",
	process.env.TFNSW_API_URL_ALPINE ||
		"https://api.transport.nsw.gov.au/v1/live/hazards/alpine/open",
	process.env.TFNSW_API_URL_FIRE ||
		"https://api.transport.nsw.gov.au/v1/live/hazards/fire/open",
	process.env.TFNSW_API_URL_FLOOD ||
		"https://api.transport.nsw.gov.au/v1/live/hazards/flood/open",
	process.env.TFNSW_API_URL_MAJOR_EVENT ||
		"https://api.transport.nsw.gov.au/v1/live/hazards/majorevent/open",
];

export const run = async () => {
	const apiKey = process.env.TFNSW_API_KEY;
	const endpoints = apiURLs.filter(Boolean);
	const alerts = [];

	if (!apiKey) {
		console.warn("TFNSW_API_KEY not set; skipping collector");
		return [];
	}
	if (endpoints.length === 0) {
		console.warn("TFNSW API URLs not set; skipping collector");
		return [];
	}

	try {
		for (const apiURL of endpoints) {
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
