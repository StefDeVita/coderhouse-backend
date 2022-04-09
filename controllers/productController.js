const logger = require('../config/logger').logger
const errorLogger = require('../config/errorLogger').logger
const postProductController = (req, res)=>{
    newProduct = req.body
    if(newProduct.title === "" || newProduct.thumbnail === "" || !isNumeric(newProduct.price)){
        errorLogger.error('Error al añadir producto')
        res.render('error');
        return
    }
    productsApi.push(req.body);
    res.redirect('/')
    logger.info(`${req.route.path} ${req.method}`, 'products');
}


module.exports = {postProductController}