const moment = require('moment')

function log (request, response, next) {
    const now = moment()
    const nowFormatted = now.format('MM/DD/YYYY HH:mm:ss')
    console.log(`${nowFormatted} ${request.method} ${request.originalUrl}`)
    next()
}

module.exports = log