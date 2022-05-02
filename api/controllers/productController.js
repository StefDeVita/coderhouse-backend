const logger = require('../config/logger').logger
const errorLogger = require('../config/errorLogger').errorLogger
const productsApi = require('../containers/productsDto')


function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

const getProductController = async (req,res) =>{
    let savedProducts = await productsApi.getAll()
    res.send({statusCode:200,payload:savedProducts});  
}
const putProductController = async (req,res) =>{
    let id = req.params.id;
    let product = req.body;
    if(!isNumeric(product.price)){
        res.send({"error":"Ingrese un precio o stock válido"})
        return;
    }
    product.price = Number(product.price);
    product.stock = Number(product.stock);
    let newProduct = await productsApi.update(id,product)
    if(!newProduct){
        res.send({"error":"No se encuentra el producto"})
    }
    res.send({statusCode:200,payload:newProduct});
}

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
const deleteProductController = (req, res)=>{
    let id = req.params.id;
    if(!(productsApi.get(id))){
        res.send({"error":"No se encuentra el producto"})
        return
    }
    let erasedProduct =  productsApi.delete(id);
    res.send({statusCode:200,erasedProduct});
}

module.exports = {postProductController,getProductController,putProductController,deleteProductController}