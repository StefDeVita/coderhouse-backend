const io = require('../config/socket').get()
const productsApi = require('../containers/productsApi')
const users = require('../daos/userDAO')

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

const newProductController = data =>{
    if(data.title === "" || data.thumbnail === "" || !isNumeric(data.price)){
        errorLogger.error('Error al añadir producto')
        io.sockets.emit('error');
        return
    }
    data.price = Number(data.price);
    productsApi.push(data);
    productsApi.getAll().then(products =>{
        io.sockets.emit('products',products)
    }
    )}

const addCartController = async data =>{ 
    let userid = data.user;
    const user = await users.getById(userid)
    let product = await productsApi.get(data.product)
    if(user.cart.products.indexOf(product[0])!= -1){
        product[0].quantity++;
    }
    else{
        product[0].quantity = 1
        user.cart.products.push(product[0])
    }
    user.cart.total = 0;
    user.cart.products.forEach(product => {
        user.cart.total += product.price
    });
    await users.update(userid,user);
    io.sockets.emit('add-cart',user.cart)

    
    
}
const newMessageController = async data =>{ 
    let userid = data.user;
    const user = await users.getById(userid)
    let product = await productsApi.get(data.product)
    if(user.cart.products.indexOf(product[0])!= -1){
        product[0].quantity++;
    }
    else{
        product[0].quantity = 1
        user.cart.products.push(product[0])
    }
    user.cart.total = 0;
    user.cart.products.forEach(product => {
        user.cart.total += product.price
    });
    await users.update(userid,user);
    io.sockets.emit('add-cart',user.cart)

    
    
}

module.exports = {newProductController,addCartController,newMessageController}