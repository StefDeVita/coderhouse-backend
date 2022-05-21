const logger = require('../config/logger').logger
const errorLogger = require('../config/errorLogger').errorLogger
const io = require('../config/socket').get()
const productsApi = require('../containers/productsDto')
const messagesApi = require('../containers/messagesDto')
const users = require('../daos/userDAO')
const messageSchema = require('../../models/messageSchema')
const {normalize} = require('normalizr')

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
const validateEmail = (inputText) =>{
    var mailFormat = /\S+@\S+\.\S+/;
    if(inputText.match(mailFormat))
    {
        return true;
    }
    else
    {
        return false;
    }
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
    let flag = false;
    const user = await users.getById(userid)
    let product = await productsApi.get(data.product)
    user.cart.products.forEach((cartProduct,index) => {
        if(String(cartProduct._id) == String(product._id)){
            user.cart.products[index].amount++;
            flag= true

        }
    });
    if(!flag){
        product.amount = 1
        user.cart.products.push(product)
    }
    user.cart.total = 0;
    user.cart.products.forEach(product => {
        user.cart.total += product.price * product.amount
    });
    await users.update(userid,user);
    io.sockets.emit('add-cart',user.cart)

    
    
}
const newMessageController = async data =>{ 
    if(!isNumeric(data.author.age) || data.text === "" || !validateEmail(data.author.mail)){
        errorLogger.error('Error en el mensaje')
        io.sockets.emit('mailError');
        return
    }
    messagesApi.push(data);
    const messages = await messagesApi.getAll()
    messages.id = 1
    let normalizedMessages =  normalize(messages,messageSchema)
    io.sockets.emit('messages', normalizedMessages)
    
};


module.exports = {newProductController,addCartController,newMessageController}