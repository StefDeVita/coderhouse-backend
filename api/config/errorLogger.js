const winston = require('winston');

const errorLogger = winston.createLogger({
    level: 'error',
    transports:[
        new winston.transports.File({filename: 'error.log',level:'error',levelonly:false}),
    ]
})

module.exports = {errorLogger}