require('dotenv').config()
const {logger} = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const express = require("express")
const cors = require("cors")
const corsOptions = require('./config/corsOptions')
const port = 3001
const db = require("./database/db");

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

//routes
app.use('/alerts', require('./routes/alerts'))

app.listen(port, () => {
    console.log("App listening on port 3000")
  })