const winston = require('winston');



const logger = winston.createLogger({
    level: 'info',
    transports:[
        new winston.transports.Console({level:'info',levelonly:false}),
        new winston.transports.File({filename: 'warn.log',level:'warn',levelOnly:true})
        
    ]
})



module.exports = {logger}