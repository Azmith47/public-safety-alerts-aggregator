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
