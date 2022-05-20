require('dotenv').config()
const express = require('express');

const app = express()
const {createTables} = require('./options/createTable.js');
createTables();
const path = require('path')
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
const compression = require('compression')
const passport = require('passport')
const multer = require('multer')
const passportConfig = require('./api/config/passport.js')
const cpus = require("os").cpus().length;
const User = require('./models/userModel')
const {normalize} = require('normalizr')

const messageSchema = require('./models/messageSchema')

const Messages = require('./models/messageModel');
const testProducts = require('./tests/testProducts')

const {randomRouter} =require('./routers/randomRouter')
const {Router} = express;
const cookieParser = require('cookie-parser')
const session = require('express-session')
const mongoSession = require('./api/config/mongoSession')
const { indexOf } = require('./tests/testProducts');
const argv = require('./api/config/argv')
const productsApi = require('./api/containers/productsDto')
const messagesApi = require('./api/containers/messagesDto')




app.use('/cart',cartRouter)
app.use(cookieParser())
app.use(session(mongoSession))
app.use(compression())
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('views'));
app.use(express.static(__dirname + './public/img'));
app.use('/public/img',express.static('./public/img'));
app.use('/api',apiRouter)
app.use('/randomApi',randomRouter)
app.set('view engine', 'ejs');
app.set('views','./views')
app.set('socketio',io)



app.use(express.urlencoded({ extended: true }));
const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,path.join(__dirname,'public','img'))
    },
    filename: (req,file,cb) =>{
        cb(null,req.body.email + '.jpg')
    }
})
const upload = multer({storage:storage})

app.post('/products',postProductController);
app.put('/products/:id',putProductController);
app.get('/products',getProductController);
app.get('/goodbye',logoutController)
app.get('/logout',getLogoutController);
app.get('/buy',getBuyController)
app.get('/',homepageController)
app.get('/login',getLoginController)
app.delete('/products/:id',deleteProductController);
app.post('/finalizeBuy',postBuyController)

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


app.post('/register',upload.single('avatar'),postRegisterController )

app.get('/register',getRegisterController)

app.post('/login',passport.authenticate('login',{failureRedirect:'/signinError'}),postLoginController)

app.get('/signinError',getSignInErrorController)
app.get('/info',(req,res)=>{
    res.render('info',{argv:argv,cpus:cpus, process:process,__dirname:__dirname,bytes:req.socket.bytesWritten})
    logger.info(`${req.route.path} ${req.method}`, 'info');
})


app.post('*', defaultPostController);  
app.delete('*',defaultDeleteController);  
app.put('*', defaultPutController); 
module.exports = {app,argv,httpServer}