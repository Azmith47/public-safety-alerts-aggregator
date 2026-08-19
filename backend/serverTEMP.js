import 'dotenv/config'
import { logger } from './middleware/logEvents.js'
import errorHandler from './middleware/errorHandler.js'

import express from 'express'
import cors from 'cors'

import corsOptions from './config/corsOptions.js'
import { alertsCollector } from './middleware/alertsCollector.js'

import alertsRouter from './routes/alerts.js'

const port = 3001
const app = express()

//use request logger middleware
app.use(logger)

//errorhandler middleware
app.use(errorHandler)

//use cors
app.use(cors(corsOptions));

//express middleware
app.use(express.json())
app.use(express.urlencoded({extended : false}))

//alerts collecter loop
setInterval(alertsCollector, 600000)

//routes
app.use('/alerts', alertsRouter)

//start listening for API calls
app.listen(port, () => {
  console.log("App listening on port " + port)
})