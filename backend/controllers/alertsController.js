const Parser = require('rss-parser');
const parser = new Parser();

class Alert{
    constructor(title, link, pubDate, markerPoint, type, lastUpdated, category, id){
        this.title = title || 'No title';
        this.link = link || 'No link';
        this.pubDate = pubDate || null;
        this.markerPoint = markerPoint || null;
        this.type = type || 'No type';
        this.category = category || 'No Category'
        this.lastUpdated = lastUpdated || null;
        this.id = id || null;
    }
}

class FireAlert extends Alert{
    constructor(title, link, pubDate, alertLevel, status, markerPoint, polygon, category, location, councilArea, size, fire, agency, lastUpdated, id){
        const type = 'Fire'
        super(title, link, pubDate, markerPoint, type, lastUpdated, category, id);
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

class TrafficAlert extends Alert{
    constructor(title, id, link, pubDate, markerPoint, polyline, lastUpdated, category, planned, startDate, endDate, ended, delay, headline, impactingNetwork, isMajor, queueLength, roads, speedLimit, subCategory, otherLinks, diversions, attendingGroups, advice){
        const type = 'Traffic'
        super(title, link, pubDate, markerPoint, type, lastUpdated, category, id)
        this.planned = planned || false
        this.startDate = startDate || null
        this.endDate = endDate || null
        this.polyline = polyline || null
        this.ended = ended || false
        this.delay = delay || 0
        this.headline = headline || null
        this.impactingNetwork = impactingNetwork || false
        this.isMajor = isMajor || false
        this.queueLength = this.queueLength || 0
        this.roads = roads || null
        this.speedLimit = speedLimit || 0
        this.subCategory = subCategory || null
        this.otherLinks = otherLinks || null
        this.diversions = diversions || null
        this.attendingGroups = attendingGroups || null
        this.advice = advice || null
    }
}

class WeatherAlert extends Alert{
    constructor(title, link, pubDate, markerPoint, lastUpdated, category, id, polygon, status, alertLevel, location){
        const type = 'Weather'
        super(title, link, pubDate, markerPoint, type, lastUpdated, category, id)
        this.polygon = polygon || null;
        this.status = status || 'No status';
        this.alertLevel = alertLevel || 'No alert level';
        this.location = location || 'No location';
        this.category = category || 'No category';
    }
}

const geoJsonToPaths = (geoJson) => {
  return geoJson.coordinates[0].map(([lng, lat]) => ({
  lat,
  lng
}))
};

const geoJsonToMarker = (geoJson) => {
    return {lat: geoJson.coordinates[1], lng: geoJson.coordinates[0]}
}

const splitDescription = (description) => {
    const parts = description.split('<br />').map(part => part.trim());
    
    const values = {
        location: '',
        councilArea: '',
        size: 0,
        fire: false,
        agency: '',
        lastUpdated: '',
        status: '',
        category: ''
    };

    parts.forEach(part => {
        const partSplit = part.split(':');

        switch (partSplit[0].toLowerCase()) {
            case 'location':
                values.location = partSplit[1].trim();
                break;
            case 'council area':
                values.councilArea = partSplit[1].trim();
                break;
            case 'size':
                values.size = parseInt(partSplit[1].trim());
                break;
            case 'fire':
                values.fire = partSplit[1].trim() === 'Yes';
                break;
            case 'responsible agency':
                values.agency = partSplit[1].trim();
                break;
            case 'updated':
                values.lastUpdated = partSplit[1].trim() + ':' + partSplit[2].trim();
                break;
            case 'status':
                values.status = partSplit[1].trim();
                break;
            case 'category':
                values.category = partSplit[1].trim();
                break;
        }
    });

    return values
}

const parsePubDate = (dateString) => {
    // 1. Split date and time components
    const [datePart, timePart, ampm] = dateString.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    let [hours, minutes, seconds] = timePart.split(':').map(Number);

    // 2. Adjust hours for AM/PM
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    // 3. Create Date object (Note: months are 0-indexed in JS, so subtract 1)
    const date = new Date(year, month - 1, day, hours, minutes, seconds);

    return date;
}

const getAlerts = async (req, res) => {
    const feedURL = 'https://www.rfs.nsw.gov.au/feeds/majorIncidents.json'
    const response = await fetch(feedURL)
    const data = await response.json()
    const alerts = []

    data?.features.forEach(feature => {
        const title = feature?.properties?.title || 'No title';
        const description = feature?.properties?.description || 'No description';
        const link = feature?.properties?.link || 'No link';
        const pubDate = parsePubDate(feature?.properties?.pubDate) || 'No publication date';
        const alertLevel = feature?.properties?.category || 'No alert level';
        const guuid = feature?.properties?.guid || null
        let id = null
        let markerPoint = null
        let polygon = null

        const splitGuuid = guuid.split('/');
        id = splitGuuid[6] || null

        const markerPointGeoJson = feature?.geometry?.geometries?.[0] || feature?.geometry || null;
        const polygonGeoJson = feature?.geometry?.geometries?.[1]?.geometries?.[0] || null;

        if(markerPointGeoJson != null){
            markerPoint = geoJsonToMarker(markerPointGeoJson)
        }

        if(polygonGeoJson != null){
            polygon = geoJsonToPaths(polygonGeoJson)
        }

        let { location, councilArea, size, fire, agency, lastUpdated, status, category } = splitDescription(description);

        lastUpdated = new Date(lastUpdated);

        const alert = new FireAlert(title, link, pubDate, alertLevel, status, markerPoint, polygon, category, location, councilArea, size, fire, agency, lastUpdated, id);
        alerts.push(alert);
    })

    res.status(200).json(alerts)
}

const getTrafficAlerts = async (req, res) => {
    const apiURLs = [
        'https://api.transport.nsw.gov.au/v1/live/hazards/incident/all',
        'https://api.transport.nsw.gov.au/v1/live/hazards/roadwork/all',
        'https://api.transport.nsw.gov.au/v1/live/hazards/alpine/all',
        'https://api.transport.nsw.gov.au/v1/live/hazards/fire/all',
        'https://api.transport.nsw.gov.au/v1/live/hazards/flood/all',
        'https://api.transport.nsw.gov.au/v1/live/hazards/majorevent/all'
    ]

    const apiKey = process.env.TFNSW_API_KEY
    const alerts = []

    for(const apiURL of apiURLs){
        const response = await fetch(apiURL, {
            headers: {
                'Authorization': `apikey ${apiKey}`
            }
        });
        const data = await response.json();
        
        data?.features.forEach(feature => {
            const title = feature?.properties?.displayName || 'No title';
            const id = feature?.id || null
            const link = 'https://www.livetraffic.com/incident-details/' + id || 'No link';
            const pubDate = new Date(feature?.properties?.created) || null;

            const markerPointGeoJson = feature?.geometry || null;
            let markerPoint = null

            const polyline = feature?.properties?.encodedPolylines || null
            const lastUpdated = new Date(feature?.properties?.lastUpdated) || null;
            const category = feature?.properties?.mainCategory || 'No category';

            const plannedString = feature?.properties?.incidentKind || null
            const planned = plannedString === 'Planned' ? true : false

            const startDate = new Date(feature?.properties?.start) || null;
            const endDate = new Date(feature?.properties?.end) || null;
            const ended = feature?.properties?.ended || false
            const delay = feature?.properties?.delay || 0
            const headline = feature?.properties?.headline || null
            const impactingNetwork = feature?.properties?.impactingNetwork || false
            const isMajor = feature?.properties?.isMajor || false
            const queueLength = feature?.properties?.queueLength || 0
            const roads = feature?.properties?.roads || null
            const speedLimit = feature?.properties?.speedLimit || 0
            const subCategory = feature?.properties?.subCategoryA || null
            const otherLinks = feature?.properties?.webLinks || null
            const diversions = feature?.properties?.diversions || null
            const attendingGroups = feature?.properties?.attendingGroups || null

            const adviceA = feature?.properties?.adviceA || null
            const adviceB = feature?.properties?.adviceB || null
            const adviceC = feature?.properties?.adviceC || null
            const advice = [adviceA, adviceB, adviceC]

            if(markerPointGeoJson != null){
                markerPoint = geoJsonToMarker(markerPointGeoJson)
            }

            const alert = new TrafficAlert(title, id, link, pubDate, markerPoint, polyline, lastUpdated, category, planned, startDate, endDate, ended, delay, headline, impactingNetwork, isMajor, queueLength, roads, speedLimit, subCategory, otherLinks, diversions, attendingGroups, advice);
            alerts.push(alert);
    })
    }

    res.status(200).json(alerts);
};

module.exports = { getAlerts, getTrafficAlerts };