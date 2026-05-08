const {logEvents} = require('./logEvents')

const errorHandler = (req, res, next, err) => {
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt')
    console.error(err.stack)
}

module.exports = errorHandler