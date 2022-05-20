const bcrypt = require('bcrypt');
const logger = require('../config/logger').logger
const users = require('../daos/userDAO')
const path = require('path')
const errorLogger = require('../config/errorLogger').errorLogger
const {sendBuyMailandMessage,sendRegisterMail} = require('./messagesController')

const homepageController = (req,res)=>{

    if(req.isAuthenticated()){
        let port = ''
        if(!process.env.PORT){
            port = ':8080'
        }
        res.render('form',{user:req.user,path: req.protocol + "://" + req.hostname + port});
    }
    else{
        res.render('form')
    }
    logger.info(`${req.route.path} ${req.method}`, 'home');
}

const logoutController = (req,res)=>{
    let name = req.session.name;
    req.session.destroy(err => console.log(err));
    res.render('goodbye',{name:name});
    logger.info(`${req.route.path} ${req.method}`, 'goodbye');
    
}

const getLoginController = (req,res)=>{
    res.render('form');
    logger.info(`${req.route.path} ${req.method}`, 'login');
}


const postRegisterController = async (req, res,next) => {
    logger.info(`${req.route.path} ${req.method}`, 'register');
    let hash = bcrypt.hashSync(req.body.password,parseInt(process.env.BCRYPT_ROUNDS))
    const newUser = {
        email: req.body.email,
        password: hash,
        name:req.body.name,
        adress: req.body.address,
        telephone: req.body.telephone,
        age: Number(req.body.age),
        imgPath:path.join(process.cwd() , 'public','img' , req.body.email),
        cart: {products:[],timestamp: new Date()}
    }
    const user = await users.getByEmail(req.body.email);
    if(user.length !== 0) {
        console.log(user.length)
        res.render('signupError')
        errorLogger.error('signuperror')
        return
    }
    console.log('creating new user')
    users.save(newUser)
    res.render('signupSuccess');
    await sendRegisterMail(newUser);
}

const getRegisterController = (req,res)=>{
    res.render('register')
    logger.info(`${req.route.path} ${req.method}`, 'register');
}

const postLoginController = (req,res)=>{
    res.redirect('/')
    logger.info(`${req.route.path} ${req.method}`, 'login');
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
const getSignInErrorController = (req,res)=>{
    res.render('signinError')
}
const getLogoutController = (req,res)=>{
    res.redirect('/goodbye')
    logger.info(`${req.route.path} ${req.method}`, 'logout');
}
module.exports = {homepageController,logoutController,getLoginController,postRegisterController,getRegisterController,postLoginController,validateEmail,validateEmail,getSignInErrorController,getLogoutController}