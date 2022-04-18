const {sendBuyMailandMessage,sendRegisterMail} = require('./messagesController')
const users = require('../daos/userDAO')

const getBuyController = async (req,res)=>{
    if(req.isAuthenticated()){
        let user = await users.getById(req.user)
        res.render('buy',{user:user})
    }
    else{
        res.render('loginError');
    }
    
}

const postBuyController = async (req,res) =>{
    let user = await users.getById(req.user)
    sendBuyMailandMessage(user)
    user.cart = {products:[],timestamp:new Date()}
    users.update(req.user._id,user)
    res.render('finalizedBuy')
}



module.exports = {getBuyController, postBuyController}