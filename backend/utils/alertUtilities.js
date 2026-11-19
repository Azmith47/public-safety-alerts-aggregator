/**
 * stripHTML
 *
 * Strips HTML elements from a string
 * @param {String} value
 * @returns String
 */
export function stripHtml(value) {
	if (!value || typeof value !== "string") {
		return "";
	}

	return value
		.replace(/<br\s*\/?>/gi, "\n")
		.replace(/<[^>]+>/g, "")
		.trim();
}

export const geoJsonToPaths = (geoJson) => {
	return geoJson.coordinates[0].map(([lng, lat]) => ({
		lat,
		lng,
	}));
};

/**
 * geoJsonToMarker
 *
 * DEPRECATED
 * Replaced by normalizeMarker in locationTransformer.js
 * @param {*} geoJson
 * @returns
 */
export const geoJsonToMarker = (geoJson) => {
	return { lat: geoJson.coordinates[1], lng: geoJson.coordinates[0] };
};

/**
 * splitDescription
 *
 * DEPRECATED
 * Replaced by extractDescriptionFields in rfsNormalizer
 * @param {*} description
 * @returns
 */
export const splitDescription = (description) => {
	const parts = description.split("<br />").map((part) => part.trim());

	const values = {
		location: "",
		councilArea: "",
		size: 0,
		fire: false,
		agency: "",
		lastUpdated: "",
		status: "",
		category: "",
	};

	parts.forEach((part) => {
		const partSplit = part.split(":");

		switch (partSplit[0].toLowerCase()) {
			case "location":
				values.location = partSplit[1].trim();
				break;
			case "council area":
				values.councilArea = partSplit[1].trim();
				break;
			case "size":
				values.size = parseInt(partSplit[1].trim());
				break;
			case "fire":
				values.fire = partSplit[1].trim() === "Yes";
				break;
			case "responsible agency":
				values.agency = partSplit[1].trim();
				break;
			case "updated":
				values.lastUpdated =
					partSplit[1].trim() + ":" + partSplit[2].trim();
				break;
			case "status":
				values.status = partSplit[1].trim();
				break;
			case "category":
				values.category = partSplit[1].trim();
				break;
		}
	});

	return values;
};
