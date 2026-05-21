const Parser = require('rss-parser');
const parser = new Parser();

const { FireAlert, TrafficAlert, WeatherAlert } = require('../models/alertClasses');
const { geoJsonToPaths, geoJsonToMarker, splitDescription, parsePubDate } = require('../utils/alertUtilities');
const AlertQueryService = require('../services/AlertQueryService');

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

const getAlertsFromDb = async (req, res) => {
    try {
        const filters = {};
        if (req.query.active !== undefined) filters.active = req.query.active === 'true';
        if (req.query.category_id) filters.category_id = parseInt(req.query.category_id);
        if (req.query.source_id) filters.source_id = parseInt(req.query.source_id);
        if (req.query.severity_level_id) filters.severity_level_id = parseInt(req.query.severity_level_id);
        if (req.query.status_type_id) filters.status_type_id = parseInt(req.query.status_type_id);
        if (req.query.region_id) filters.region_id = parseInt(req.query.region_id);
        if (req.query.council_area_id) filters.council_area_id = parseInt(req.query.council_area_id);
        if (req.query.location_id) filters.location_id = parseInt(req.query.location_id);
        if (req.query.q) filters.q = req.query.q;
        if (req.query.startDate) filters.startDate = req.query.startDate;
        if (req.query.endDate) filters.endDate = req.query.endDate;

        const options = {
            limit: req.query.limit ? parseInt(req.query.limit) : undefined,
            offset: req.query.offset ? parseInt(req.query.offset) : undefined,
            sortBy: req.query.sortBy,
            sortDir: req.query.sortDir
        };

        const result = await AlertQueryService.queryAlerts(filters, options);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to query alerts' });
    }
};

const getAlertById = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await AlertQueryService.getAlertDetails(id);
        if (!result) return res.status(404).json({ error: 'Alert not found' });
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch alert details' });
    }
};

const unsubscribe = async (req, res) => {

    const { token } = req.params;

    const user =
        await UserDAO.getByUnsubscribeToken(
            token
        );

    if (!user) {
        return res
            .status(404)
            .send("Invalid token");
    }

    await SubscriptionDAO.disableForUser(
        user.id
    );

    res.send(
        "You have been unsubscribed."
    );
};

module.exports = { getAlerts, getTrafficAlerts, getAlertsFromDb, getAlertById, unsubscribe };
