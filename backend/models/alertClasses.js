class Alert {
    constructor(id, title, link, pubDate, markerPoint, type, lastUpdated, category, external_id) {
        this.id = id || null;
        this.external_id = id || null;
        this.title = title || 'No title';
        this.link = link || 'No link';
        this.pubDate = pubDate || null;
        this.markerPoint = markerPoint || null;
        this.type = type || 'No type';
        this.category = category || 'No Category';
        this.lastUpdated = lastUpdated || null;
    }
}

class FireAlert extends Alert {
    constructor(title, link, pubDate, alertLevel, status, markerPoint, polygon, category, location, councilArea, size, fire, agency, lastUpdated, id, external_id) {
        const type = 'Fire';
        super(id, title, link, pubDate, markerPoint, type, lastUpdated, category, external_id);
        this.location = location || 'No location';
        this.councilArea = councilArea || 'No council area';
        this.size = size || 0;
        this.fire = fire || null;
        this.agency = agency || 'No agency';
        this.polygon = polygon || null;
        this.status = status || 'No status';
        this.alertLevel = alertLevel || 'No alert level';
    }
}

class TrafficAlert extends Alert {
    constructor(title, id, external_id, link, pubDate, markerPoint, polyline, lastUpdated, category, planned, startDate, endDate, ended, delay, headline, impactingNetwork, isMajor, queueLength, roads, speedLimit, subCategory, otherLinks, diversions, attendingGroups, advice) {
        const type = 'Traffic';
        super(id, title, link, pubDate, markerPoint, type, lastUpdated, category, external_id);
        this.planned = planned || false;
        this.startDate = startDate || null;
        this.endDate = endDate || null;
        this.polyline = polyline || null;
        this.ended = ended || false;
        this.delay = delay || 0;
        this.headline = headline || null;
        this.impactingNetwork = impactingNetwork || false;
        this.isMajor = isMajor || false;
        this.queueLength = this.queueLength || 0;
        this.roads = roads || null;
        this.speedLimit = speedLimit || 0;
        this.subCategory = subCategory || null;
        this.otherLinks = otherLinks || null;
        this.diversions = diversions || null;
        this.attendingGroups = attendingGroups || null;
        this.advice = advice || null;
    }
}

class WeatherAlert extends Alert {
    constructor(title, link, pubDate, markerPoint, lastUpdated, category, id, polygon, status, alertLevel, location, external_id) {
        const type = 'Weather';
        super(id, title, link, pubDate, markerPoint, type, lastUpdated, category, external_id);
        this.polygon = polygon || null;
        this.status = status || 'No status';
        this.alertLevel = alertLevel || 'No alert level';
        this.location = location || 'No location';
        this.category = category || 'No category';
    }
}

module.exports = { Alert, FireAlert, TrafficAlert, WeatherAlert };
