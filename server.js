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
const io = require('./api/config/socket.js').init(httpServer);
const {MongoContainer} = require('./api/containers/mongoContainer')
const {cartRouter,carts} = require('./routers/cartRouter')
const {apiRouter} = require('./routers/apiRouter')
const {logger,errorLogger} = require('./api/config/logger')
const {getBuyController,postBuyController} = require('./api/controllers/buyController')
const {newProductController,addCartController,newMessageController} = require('./api/controllers/socketsController')
const {homepageController,logoutController,getLoginController,postRegisterController,getRegisterController,postLoginController,validateEmail,getSignInErrorController,getLogoutController} = require('./api/controllers/authController')
const {defaultPutController,defaultDeleteController,defaultPostController} = require('./api/controllers/defaultController')
const {postProductController,getProductController,putProductController,deleteProductController} = require('./api/controllers/productController')
const passport = require('koa-passport')
const multer = require('multer')
const passportConfig = require('./api/config/passport.js')
const cpus = require("os").cpus().length;
const User = require('./models/userModel')
const {normalize} = require('normalizr')

const messageSchema = require('./models/messageSchema')


const {randomRouter} =require('./routers/randomRouter')
const Router = require('koa-router')
const cookieParser = require('koa-cookie')
const session = require('koa-session');
const mongoSession = require('./api/config/mongoSession')
const argv = require('./api/config/argv')
const productsApi = require('./api/containers/productsDto')
const messagesApi = require('./api/containers/messagesDto')

const router = new Router()
app.keys = ['key']
app.use(session(app))
app.use(cookieParser.default())
app.use(cartRouter.routes())
app.use(passport.initialize());
app.use(passport.session());
app.use(serve(__dirname + '/public/img'));
app.use(apiRouter.routes())
app.use(randomRouter.routes())
render(app, {
    root: path.join(__dirname, 'views'),
    layout:false,
    viewExt: 'html',
    cache: false,
    debug: true
  });




const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,'./public/img')
    },
    filename: (req,file,cb) =>{
        cb(null,req.body.email + '.jpg')
    }
})
const upload = multer({storage:storage})


router.get('/products',getProductController);
router.post('/products',postProductController);
router.put('/products/:id',putProductController);
router.get('/goodbye',logoutController)
router.get('/logout',getLogoutController);
router.get('/buy',getBuyController)
router.get('/',homepageController)
router.get('/login',getLoginController)
router.delete('/products/:id',deleteProductController);
router.post('/finalizeBuy',postBuyController)
router.post('/register',upload.single('avatar'),postRegisterController )

router.get('/register',getRegisterController)

router.post('/login',passport.authenticate('login',{failureRedirect:'/signinError'}),postLoginController)

router.get('/signinError',getSignInErrorController)
router.get('/info',(req,res)=>{
    res.render('info',{argv:argv,cpus:cpus, process:process,__dirname:__dirname,bytes:req.socket.bytesWritten})
    logger.info(`${req.route.path} ${req.method}`, 'info');
})

io.on('connection', (socket,req) => {
    console.log('Un cliente se ha conectado');
    (async () =>{
    
    let products = await productsApi.getAll();
    let normalizedMessages = await messagesApi.getAll()
    if(normalizedMessages !== []){
        normalizedMessages.id = 1
        normalizedMessages = normalize(normalizedMessages,messageSchema)
    }
    socket.emit('products',products)
    socket.emit('messages',normalizedMessages)
    socket.on('product',newProductController) 
    socket.on('new-product',addCartController)
    socket.on('new-message',newMessageController);
    })()
});



app.use(router.routes())
.use(router.allowedMethods())

  
module.exports = {app,argv,httpServer}