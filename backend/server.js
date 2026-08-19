import 'dotenv/config'
import {logger} from './middleware/logEvents.js'
import errorHandler from './middleware/errorHandler.js'
import express from "express"
import cors from "cors"
import corsOptions from './config/corsOptions.js'

import db from "./database/db.js";
import NotificationService from "./services/NotificationService.js";
import { initializeIngestScheduler, initializeMaintenanceScheduler } from "./services/SchedulerService.js";
import IngestOrchestratorService from "./services/IngestOrchestratorService.js";
import alertsRouter from './routes/alerts.js'
import sourcesRouter from './routes/sources.js'
import geoRouter from './routes/geo.js'
import mapRouter from './routes/map.js' // Added this line to import the map router

const port = process.env.PORT
const app = express()

//use request logger middleware
app.use(logger)

//use cors
app.use(cors(corsOptions));

//express middleware
app.use(express.json())
app.use(express.urlencoded({extended : false}))

//routes
app.use('/alerts', alertsRouter)
app.use('/sources', sourcesRouter)
app.use('/geo', geoRouter)
app.use('/map', mapRouter) // Added this line to handle /map routes

//errorhandler middleware
app.use(errorHandler)

// run orchestrator once on startup to populate initial data
await IngestOrchestratorService.initialAlertDataLoad();
// start background notification processing
NotificationService.startProcessing();  
// start background ingest scheduler (every 10 minutes)
initializeIngestScheduler('*/10 * * * *');
// start maintenance scheduler (daily cleanup)
initializeMaintenanceScheduler(process.env.MAINTENANCE_CRON || '0 4 * * *');

app.listen(port, async () => {
  console.log(`App listening on port ${port}`)
})
