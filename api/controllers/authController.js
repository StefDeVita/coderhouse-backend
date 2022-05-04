const bcrypt = require('bcrypt');
const logger = require('../config/logger').logger
const users = require('../daos/userDAO')
const errorLogger = require('../config/errorLogger')
const {sendBuyMailandMessage,sendRegisterMail} = require('./messagesController')

const homepageController = async (ctx)=>{
    if(!ctx.session.isNew){
        let port = ''
        if(!process.env.PORT){
            port = ':8080'
        }
        await ctx.render('form',{user:ctx.user,path: ctx.protocol + "://" + ctx.hostname + port});
    }
    else{
        await ctx.render('form')
    }
    logger.info(`${ctx.path} ${ctx.method}`, 'home');
}

const logoutController = ctx=>{
    let name = ctx.session.name;
    ctx.session.destroy(err => console.log(err));
    ctx.render('goodbye',{name:name});
    logger.info(`${req.route.path} ${req.method}`, 'goodbye');
    
}

const getLoginController = async ctx=>{
    await ctx.render('form');
    logger.info(`${req.route.path} ${req.method}`, 'login');
}


const postRegisterController = async ctx => {
    logger.info(`${ctx.request.path} ${ctx.request.method}`, 'register');
    let hash = bcrypt.hashSync(ctx.request.body.password,parseInt(process.env.BCRYPT_ROUNDS))
    const newUser = {
        email: ctx.request.body.email,
        password: hash,
        name:ctx.request.body.name,
        adress: ctx.request.body.address,
        telephone: ctx.request.body.telephone,
        age: Number(ctx.request.body.age),
        imgPath:'/public/img/' + ctx.request.body.email,
        cart: {products:[],timestamp: new Date()}
    }
    const user = await users.getByEmail(ctx.request.body.email);
    if(user){
        ctx.render('signupError')
        errorLogger.error('signuperror')
        return
    }
    console.log('creating new user')
    users.save(newUser)
    res.render('signupSuccess');
    await sendRegisterMail(newUser);
}

const getRegisterController = async ctx=>{
    await ctx.render('register')
    logger.info(`${ctx.request.path} ${ctx.request.method}`, 'register');
}

const postLoginController = ctx=>{
    ctx.redirect('/')
    logger.info(`${ctx.request.path} ${ctx.request.method}`, 'login');
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
const getSignInErrorController = async ctx=>{
    await ctx.render('signinError')
}
const getLogoutController = ctx=>{
    ctx.redirect('/goodbye')
    logger.info(`${ctx.request.path} ${ctx.request.method}`, 'logout');
}

module.exports = {homepageController,logoutController,getLoginController,postRegisterController,getRegisterController,postLoginController,validateEmail,validateEmail,getSignInErrorController,getLogoutController}