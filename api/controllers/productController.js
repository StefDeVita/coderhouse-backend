const logger = require('../config/logger').logger
const errorLogger = require('../config/errorLogger').errorLogger
const productsApi = require('../containers/productsDto')


function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

const getProductController = async (ctx) =>{
    let savedProducts = await productsApi.getAll()
    ctx.body= {statusCode:200,payload:savedProducts};
}
const putProductController = async ctx =>{
    let id = ctx.params.id;
    let product = ctx.request.body;
    if(!isNumeric(product.price)){
        ctx.body={"error":"Ingrese un precio o stock válido"}
        return;
    }
    product.price = Number(product.price);
    product.stock = Number(product.stock);
    let newProduct = await productsApi.update(id,product)
    if(!newProduct){
        ctx.body={"error":"No se encuentra el producto"}
    }
    ctx.body={statusCode:200,payload:newProduct};
}

const postProductController = ctx=>{
    newProduct = ctx.request.body
    if(newProduct.title === "" || newProduct.thumbnail === "" || !isNumeric(newProduct.price)){
        errorLogger.error('Error al añadir producto')
        res.render('error');
        return
    }
    productsApi.push(ctx.request.body);
    ctx.body = newProduct
    
    logger.info(`${ctx.request.path} ${ctx.request.method}`, 'products');
}
const deleteProductController = async ctx=>{
    let id = ctx.params.id;
    if(!(await productsApi.get(id))){
        ctx.body={"error":"No se encuentra el producto"}
        return
    }
    let erasedProduct = await productsApi.delete(id);
    ctx.body={statusCode:200,erasedProduct};
}

module.exports = {postProductController,getProductController,putProductController,deleteProductController}