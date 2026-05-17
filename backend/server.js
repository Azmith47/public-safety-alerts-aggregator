require('dotenv').config()
const {logger} = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const express = require("express")
const cors = require("cors")
const corsOptions = require('./config/corsOptions')
const port = 3001
const { alertsCollector } = require('./middleware/alertsCollector')

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
app.use('/alerts', require('./routes/alerts'))

//start listening for API calls
app.listen(port, () => {
    console.log("App listening on port " + port)
  })