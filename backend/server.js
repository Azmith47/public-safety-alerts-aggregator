require('dotenv').config()
const {logger} = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const express = require("express")
const cors = require("cors")
const corsOptions = require('./config/corsOptions')
const port = 3001
const db = require("./database/db");
const NotificationService = require("./services/NotificationService");
const { initializeIngestScheduler, initializeMaintenanceScheduler } = require("./services/SchedulerService");

const app = express()

//use request logger middleware
app.use(logger)

//use cors
app.use(cors(corsOptions));

//express middleware
app.use(express.json())
app.use(express.urlencoded({extended : false}))

//routes
app.use('/alerts', require('./routes/alerts'))
app.use('/sources', require('./routes/sources'))
app.use('/geo', require('./routes/geo'))

//errorhandler middleware
app.use(errorHandler)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  // start background notification processing
  NotificationService.startProcessing();
  // start background ingest scheduler (every 5 minutes)
  initializeIngestScheduler('*/5 * * * *');
  // start maintenance scheduler (daily cleanup)
  initializeMaintenanceScheduler(process.env.MAINTENANCE_CRON || '0 4 * * *');
  })