// const Parser = require('rss-parser');
// const parser = new Parser();
const fs = require('fs')

//define alert class
class Alert{
    //Alert constructor
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

//define fire alert subclass
class FireAlert extends Alert{
    //FireAlert constructor
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

//define traffic alert subclass
class TrafficAlert extends Alert{
    //TrafficAlert constructor
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

//define weather alert class
    //W.I.P
class WeatherAlert extends Alert{
    //WeatherAlert constructor
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

//function to convert GeoJson coordinates into a path format compatible with Google Maps
const geoJsonToPaths = (geoJson) => {
    //flip all longitudes and latitudes and convert from an array to an object
    return geoJson.coordinates[0].map(([lng, lat]) => ({lat, lng}))
};

//function to convert GeoJson coordinates into a point format compatible with Google Maps
const geoJsonToMarker = (geoJson) => {
    return {lat: geoJson.coordinates[1], lng: geoJson.coordinates[0]}
}

//function to split the description on RFS alerts to populate fileds of the class
const splitDescription = (description) => {
    //split the description string at each HTML line break
    const parts = description.split('<br />').map(part => part.trim());
    
    //establish all variables to collect from description
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

    //collect all variable values from the split strings
    parts.forEach(part => {
        //split each string at the colon to get the label and value
        const partSplit = part.split(':');

        //check what the label is to asign value to correct variable
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
            case 'type':
                values.category = partSplit[1].trim();
                break;
        }
    });

    //return values from description
    return values
}

//function to parse published date from RFS alerts that appears in wrong format
const parsePubDate = (dateString) => {
    //Split date and time components
    const [datePart, timePart, ampm] = dateString.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    let [hours, minutes, seconds] = timePart.split(':').map(Number);

    //Adjust hours for AM/PM
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    //Create Date object (Note: months are 0-indexed in JS, so subtract 1)
    const date = new Date(year, month - 1, day, hours, minutes, seconds);

    //return formatted date
    return date;
}

//function to regularly collect alerts from all data sources and update database
const alertsCollector = async () => {
    //get alerts
    const fireAlerts = await fetchFireAlerts()
    const trafficAlerts = await fetchTrafficAlerts()

    //update database
    updateDatabase(fireAlerts, trafficAlerts)
};

//function to get RFS alerts
const fetchFireAlerts = async () => {
    //request alerts from RFS JSON feed
    const feedURL = 'https://www.rfs.nsw.gov.au/feeds/majorIncidents.json'
    const response = await fetch(feedURL)
    const data = await response.json()
    const alerts = []

    //loop theough the RFS GeoJson to create each alert
    data?.features.forEach(feature => {
        //get values from the alert to populate FireAlert class fields
        const title = feature?.properties?.title || 'No title';
        const description = feature?.properties?.description || 'No description';
        const link = feature?.properties?.link || 'No link';
        const pubDate = parsePubDate(feature?.properties?.pubDate) || 'No publication date';
        const alertLevel = feature?.properties?.category || 'No alert level';
        const guuid = feature?.properties?.guid || null
        let id = null
        let markerPoint = null
        let polygon = null

        //split the RFS guuid to create a unique id for the alert
        const splitGuuid = guuid.split('/');
        id = splitGuuid[6] || null

        //get geometry from GeoJson
        const markerPointGeoJson = feature?.geometry?.geometries?.[0] || feature?.geometry || null;
        const polygonGeoJson = feature?.geometry?.geometries?.[1]?.geometries?.[0] || null;

        //convert point to the correct format
        if(markerPointGeoJson != null){
            markerPoint = geoJsonToMarker(markerPointGeoJson)
        }

        //convert polygon to the correct format
        if(polygonGeoJson != null){
            polygon = geoJsonToPaths(polygonGeoJson)
        }

        //get values from description
        let { location, councilArea, size, fire, agency, lastUpdated, status, category } = splitDescription(description);

        //convert last updated date tp the correct format
        lastUpdated = new Date(lastUpdated);

        //create a new FireAlert object and push to array
        const alert = new FireAlert(title, link, pubDate, alertLevel, status, markerPoint, polygon, category, location, councilArea, size, fire, agency, lastUpdated, id);
        alerts.push(alert);
    })

    //return all RFS alerts
    return alerts
}

//function to get all live traffic alerts
const fetchTrafficAlerts = async () => {
    //all require api endpoints to target
    const apiURLs = [
        'https://api.transport.nsw.gov.au/v1/live/hazards/incident/all',
        'https://api.transport.nsw.gov.au/v1/live/hazards/roadwork/all',
        'https://api.transport.nsw.gov.au/v1/live/hazards/alpine/all',
        'https://api.transport.nsw.gov.au/v1/live/hazards/fire/all',
        'https://api.transport.nsw.gov.au/v1/live/hazards/flood/all',
        'https://api.transport.nsw.gov.au/v1/live/hazards/majorevent/all'
    ]

    //get TFNSW api key
    const apiKey = process.env.TFNSW_API_KEY
    const alerts = []

    //loop through all api endpoints
    for(const apiURL of apiURLs){
        //send request with api key
        const response = await fetch(apiURL, {
            headers: {
                'Authorization': `apikey ${apiKey}`
            }
        });
        const data = await response.json();
        
        //loop theough the TFNSW GeoJson to create each alert
        data?.features.forEach(feature => {
            //get values from the alert to populate FireAlert class fields
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

            //convert point to correct format
            if(markerPointGeoJson != null){
                markerPoint = geoJsonToMarker(markerPointGeoJson)
            }

            //create new TrafficAlert object and push to array
            const alert = new TrafficAlert(title, id, link, pubDate, markerPoint, polyline, lastUpdated, category, planned, startDate, endDate, ended, delay, headline, impactingNetwork, isMajor, queueLength, roads, speedLimit, subCategory, otherLinks, diversions, attendingGroups, advice);
            alerts.push(alert);
        })
    }

    //return all live traffic alerts
    return alerts
}

//function to update database
const updateDatabase = (fireAlerts, trafficAlerts) => {
    //combine alerts arrays and convert to JSON
    const alerts = [...fireAlerts, ...trafficAlerts]
    const json = JSON.stringify(alerts)

    //write to alerts.json
    fs.writeFile('alerts.json', json, (err) => {
        //print error if one occurs
        if(err) console.log(err)
    })
}

module.exports = { alertsCollector };