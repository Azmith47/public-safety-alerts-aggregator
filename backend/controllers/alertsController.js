const fs = require('fs').promises

//get all alerts function
const getAlerts = async (req, res) => {
    //read JSON file
    try {
        //return all alerts
        const data = await fs.readFile('alerts.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        //return error if one occurs
        res.status(500).send(err);
    }
}

//get all fire alerts
const getFireAlerts = async (req, res) => {
    const fireAlerts = []

    //read JSON file
    try {
        const data = await fs.readFile('alerts.json', 'utf8');
        //convert from string to JSON
        const alerts = JSON.parse(data)

        //loop through alerts to collect all fire alerts
        alerts.forEach(alert => {
            //check if alert type is fire
            if(alert?.type == 'Fire') fireAlerts.push(alert)
        });

        //return all fire alerts
        res.status(200).json(fireAlerts)
    } catch (err) {
        //return error if one occurs
        res.status(500).send(err);
    }
}

//get all traffic alerts
const getTrafficAlerts = async (req, res) => {
    const trafficAlerts = []
    //read JSON file
    try {
        const data = await fs.readFile('alerts.json', 'utf8');
        //convert from string to JSON
        const alerts = JSON.parse(data)

        //loop through all alerts to collect all traffic alerts
        alerts.forEach(alert => {
            //check if alert type is traffic
            if(alert?.type == 'Traffic') trafficAlerts.push(alert)
        });

        //return all traffic alerts
        res.status(200).json(trafficAlerts)
    } catch (err) {
        //return error if one occurs
        res.status(500).send(err);
    }
}

 module.exports = { getAlerts, getTrafficAlerts, getFireAlerts };