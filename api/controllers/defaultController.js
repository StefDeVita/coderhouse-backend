const logger = require('../config/logger').logger
const errorLogger = require('../config/errorLogger').errorLogger
const defaultPostController = (req, res)=>{
    logger.warn(`${req.path} ${req.method}`)

    res.send({ error : -2, descripcion: `ruta ${req.path} método 'post' no implementada`})
}

const defaultDeleteController = (req, res) => {
    logger.warn(`${req.path} ${req.method}`)
    res.send({ error : -2, descripcion: `ruta ${req.path} método 'delete' no implementada`})
  }

const defaultPutController =(req, res)=> {
    logger.warn(`${req.path} ${req.method}`)
    res.send({ error : -2, descripcion: `ruta ${req.path} método 'put' no implementada`})
  }

module.exports = {defaultPostController,defaultDeleteController,defaultPutController}