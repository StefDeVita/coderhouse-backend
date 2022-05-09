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