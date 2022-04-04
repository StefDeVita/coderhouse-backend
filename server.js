require('dotenv').config()
const {MongoContainer} = require('./mongoContainer')
const {cartRouter,carts} = require('./routers/cartRouter')
const winston = require('winston');
const {sendBuyMailandMessage} = require('./controllers/messages')
const compression = require('compression')
const passport = require('passport')
const multer = require('multer')
const passportConfig = require('./config/passport.js')
const bcrypt = require('bcrypt');
const sharedsession = require('express-socket.io-session')
const cpus = require("os").cpus().length;
const User = require('./models/userModel')
const {normalize} = require('normalizr')
const {Container} = require('./container.js')
const {knexSQLite} = require('./options/SQLite3.js')
const {knexMariaDB} = require('./options/mariaDB.js');
const messageSchema = require('./models/messageSchema')
const {createTables} = require('./createTable.js');
const Messages = require('./models/messageModel');
const testProducts = require('./testProducts')
const ProductsApi = require('./productsApi')
createTables();
const express = require('express');
const {randomRouter} =require('./routers/randomRouter')
const {Router} = express;
const app = express()
const httpServer = require('http').Server(app)
const io = require('socket.io')(httpServer)
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const { indexOf } = require('./testProducts');
const advancedOptions = {useNewUrlParser:true,useUnifiedTopology:true}
const yargs = require('yargs/yargs')(process.argv.slice(2))


const logger = winston.createLogger({
    level: 'info',
    transports:[
        new winston.transports.Console({level:'info',levelonly:false}),
        new winston.transports.File({filename: 'warn.log',level:'warn',levelOnly:true})
        
    ]
})
const errorLogger = winston.createLogger({
    level: 'error',
    transports:[
        new winston.transports.File({filename: 'error.log',level:'error',levelonly:false}),
    ]
})
const argv = yargs.alias({
    p: 'port',
    m:'mode'
}).default({
    port:process.argv[2] || 8080,
    mode:'fork'
}).argv
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


const router = Router();
app.use('/cart',cartRouter)
app.use(cookieParser())
app.use(session({
    store:MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        mongoOptions: advancedOptions
    }),
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:6000000
    }
})
)
app.use(compression())
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('views'));
app.use(express.static(__dirname + './public/img'));
app.use('/public/img',express.static('./public/img'));
app.use('/api',router)
app.use('/randomApi',randomRouter)
app.set('view engine', 'ejs');
app.set('views','./views')
app.set('socketio',io)
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
const productsApi = new ProductsApi(knexSQLite,'products');
const messagesApi = new MongoContainer(process.env.MONGO_URI,Messages)
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

app.use(express.urlencoded({ extended: true }));
const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,'./public/img')
    },
    filename: (req,file,cb) =>{
        cb(null,req.body.email + '.jpg')
    }
})
const upload = multer({storage:storage})

app.post('/products',(req, res)=>{
    newProduct = req.body
    if(newProduct.title === "" || newProduct.thumbnail === "" || !isNumeric(newProduct.price)){
        errorLogger.error('Error al añadir producto')
        res.render('error');
        return
    }
    productsApi.push(req.body);
    res.redirect('/')
    logger.info(`${req.route.path} ${req.method}`, 'products');
});

app.get('/goodbye',(req,res)=>{
    let name = req.session.name;
    req.session.destroy(err => console.log(err));
    res.render('goodbye',{name:name});
    logger.info(`${req.route.path} ${req.method}`, 'goodbye');
    
})
app.get('/logout',(req,res)=>{
    res.redirect('/goodbye')
    logger.info(`${req.route.path} ${req.method}`, 'logout');
})
app.get('/buy',async (req,res)=>{
    if(req.isAuthenticated()){
        let user = await User.findOne({_id:req.user._id})
        res.render('buy',{user:user})
    }
    else{
        res.render('loginError');
    }
    
})
app.get('/',(req,res)=>{
    if(req.isAuthenticated()){
        let puerto = ''
        if(!process.env.port){
            puerto = ':8080'
        }
        res.render('form',{user:req.user,path: req.protocol + "://" + req.hostname + puerto});
    }
    else{
        res.render('form')
    }
    logger.info(`${req.route.path} ${req.method}`, 'home');
})
app.get('/login',(req,res)=>{
    res.render('form');
    logger.info(`${req.route.path} ${req.method}`, 'login');
})

app.post('/finalizeBuy',async (req,res) =>{
    sendBuyMailandMessage(await User.findOne({_id:req.user}))
    let user = await User.updateOne({_id:req.user._id},{ $set: { cart: {products:[]},timestamp:new Date()}})
    res.render('finalizedBuy')
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
    socket.on('product',data =>{
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
        )}) 
    socket.on('new-product',async data =>{ 
        let userid = data.user;
        const user = await User.findOne({_id:userid})
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
        await User.updateMany({_id:userid}, { $set: { cart: user.cart } });
        io.sockets.emit('add-cart',user.cart)

        
        
    })
    socket.on('new-message',async data => {
        if(!isNumeric(data.author.age) || data.text === "" || !validateEmail(data.author._id)){
            errorLogger.error('Error en el mensaje')
            io.sockets.emit('mailError');
            return
        }
        await messagesApi.save(data);
        const messages = await messagesApi.getAll()
        messages.id = 1
        let normalizedMessages =  normalize(messages,messageSchema)
        io.sockets.emit('messages', normalizedMessages)
        
    });
    })()
});

router.get('/products-test',(req,res) =>{
    res.render('testProducts',{products:testProducts})
    logger.info(`${req.route.path} ${req.method}`, 'products-test');
})

app.post('/register',upload.single('avatar'), async (req, res,next) => {
    console.log(req.file,req.body.avatar)
    logger.info(`${req.route.path} ${req.method}`, 'register');
    let hash = bcrypt.hashSync(req.body.password,parseInt(process.env.BCRYPT_ROUNDS))
    const newUser = new User({
        email: req.body.email,
        password: hash,
        name:req.body.name,
        adress: req.body.address,
        telephone: req.body.telephone,
        age: Number(req.body.age),
        imgPath:'/public/img/' + req.body.email,
        cart: {products:[],timestamp: new Date()}
    })
    const user = await User.findOne({email:req.body.email});
    if(user){
        res.render('signupError')
        errorLogger.error('signuperror')
        return
    }
    console.log('creating new user')
    newUser.save(function (err, addedUser) {
        if (err) return res.json({ err: err })
        res.render('signupSuccess')
    })
    
})

app.get('/register',(req,res)=>{
    res.render('register')
    logger.info(`${req.route.path} ${req.method}`, 'register');
})

app.post('/login',passport.authenticate('login',{failureRedirect:'/signinError'}),(req,res)=>{
    res.redirect('/')
    logger.info(`${req.route.path} ${req.method}`, 'login');
})

app.get('/signinError',(req,res)=>{
    res.render('signinError')
})
app.get('/info',(req,res)=>{
    res.render('info',{argv:argv,cpus:cpus, process:process,__dirname:__dirname,bytes:req.socket.bytesWritten})
    logger.info(`${req.route.path} ${req.method}`, 'info');
})


app.post('*', function(req, res) {
    logger.warn(`${req.path} ${req.method}`)

    res.send({ error : -2, descripcion: `ruta ${req.path} método 'post' no implementada`})
  });  
app.delete('*', function(req, res) {
    logger.warn(`${req.path} ${req.method}`)
    res.send({ error : -2, descripcion: `ruta ${req.path} método 'delete' no implementada`})
  });  
app.put('*', function(req, res) {
    logger.warn(`${req.path} ${req.method}`)
    res.send({ error : -2, descripcion: `ruta ${req.path} método 'put' no implementada`})
  });
module.exports = {app,argv,httpServer}