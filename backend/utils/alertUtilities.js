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
export function parsePubDate(value) {
	if (!value || typeof value !== "string") {
		return null;
	}

	const match = value
		.trim()
		.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})\s*(AM|PM)$/i);

	if (!match) {
		return null;
	}

	const [, day, month, year, hourStr, minute, second, meridiem] = match;

	let hour = parseInt(hourStr, 10);
	const isPM = meridiem.toUpperCase() === "PM";

	if (isPM && hour !== 12) {
		hour += 12;
	} else if (!isPM && hour === 12) {
		hour = 0;
	}

	return new Date(
		parseInt(year, 10),
		parseInt(month, 10) - 1,
		parseInt(day, 10),
		hour,
		parseInt(minute, 10),
		parseInt(second, 10)
	);
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
