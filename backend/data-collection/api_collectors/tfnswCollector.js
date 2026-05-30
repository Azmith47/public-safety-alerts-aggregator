export const sourceName = "Transport NSW";
export const sourceWebsite = "https://www.livetraffic.com";

export const apiURLs = [
	"https://api.transport.nsw.gov.au/v1/live/hazards/incident/all",
	"https://api.transport.nsw.gov.au/v1/live/hazards/roadwork/all",
	"https://api.transport.nsw.gov.au/v1/live/hazards/alpine/all",
	"https://api.transport.nsw.gov.au/v1/live/hazards/fire/all",
	"https://api.transport.nsw.gov.au/v1/live/hazards/flood/all",
	"https://api.transport.nsw.gov.au/v1/live/hazards/majorevent/all",
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
			alerts.push(...(Array.isArray(data?.features) ? data.features : []));
		}

		return alerts;
	} catch (err) {
		console.error("TFNSW Collector error:", err.message);
		return [];
	}
};

export default run;
