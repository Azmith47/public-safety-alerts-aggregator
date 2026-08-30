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

function getConfiguredApiUrls() {
	return [
		process.env.TFNSW_API_URL_INCIDENTS,
		process.env.TFNSW_API_URL_ROADWORK,
		process.env.TFNSW_API_URL_ALPINE,
		process.env.TFNSW_API_URL_FIRE,
		process.env.TFNSW_API_URL_FLOOD,
		process.env.TFNSW_API_URL_MAJOR_EVENT,
	].filter(Boolean);
}

export const run = async () => {
	const apiKey = process.env.TFNSW_API_KEY;
	const configuredApiUrls = getConfiguredApiUrls();
	const alerts = [];

	if (!apiKey) {
		console.warn("TFNSW_API_KEY not set; skipping collector");
		return [];
	}

	if (configuredApiUrls.length === 0) {
		console.warn("No TFNSW API URLs configured; skipping collector");
		return [];
	}

	try {
		for (const apiURL of configuredApiUrls) {
			try {
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
			} catch (error) {
				console.error(
					`TFNSW endpoint failed (${apiURL}):`,
					error.message,
				);
			}
		}

		return alerts;
	} catch (err) {
		console.error("TFNSW Collector error:", err.message);
		return [];
	}
};

export default run;
