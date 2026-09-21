import { logEvents } from './logEvents.js'

const errorHandler = (req, res, next, err) => {
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt')
    console.error(err.stack)
}

export default errorHandler