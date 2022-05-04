require('dotenv').config()
const Koa = require('koa')

const app = new Koa()
const koaBody = require('koa-body')
const serve = require('koa-static')
const render = require('koa-ejs');
const path = require('path')
app.use(koaBody())
const {createTables} = require('./options/createTable.js');
createTables();
const httpServer = require('http').Server(app)
const {logger,errorLogger} = require('./api/config/logger')
const {homepageController,logoutController,getLoginController,postRegisterController,getRegisterController,postLoginController,validateEmail,getSignInErrorController,getLogoutController} = require('./api/controllers/authController')
const {postProductController,getProductController,putProductController,deleteProductController} = require('./api/controllers/productController')
const cpus = require("os").cpus().length;


const Router = require('koa-router')
const argv = require('./api/config/argv')

const router = new Router()
app.use(serve(__dirname + '/public/img'));
render(app, {
    root: path.join(__dirname, 'views'),
    layout:false,
    viewExt: 'html',
    cache: false,
    debug: true
  });

router.get('/products',getProductController);
router.post('/products',postProductController);
router.put('/products/:id',putProductController);
router.get('/',homepageController)
router.delete('/products/:id',deleteProductController);



router.get('/info',async ctx=>{
    await ctx.render('info',{argv:argv,cpus:cpus, process:process,__dirname:__dirname,bytes:ctx.request.socket.bytesWritten})
    logger.info(`${ctx.request.path} ${ctx.request.method}`, 'info');
})



app.use(router.routes())
.use(router.allowedMethods())

  
module.exports = {app,argv,httpServer}