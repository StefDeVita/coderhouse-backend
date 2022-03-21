require('dotenv').config()
const {MongoContainer} = require('./mongoContainer')
const winston = require('winston');
const compression = require('compression')
const passport = require('passport')
const passportConfig = require('./config/passport.js')
const bcrypt = require('bcrypt');
const cpus = require("os").cpus().length;
const User = require('./models/userModel')
const {normalize} = require('normalizr')
const {Container} = require('./container.js')
const {knexMariaDB} = require('./options/mariaDB.js');
const messageSchema = require('./models/messageSchema')
const {createTables} = require('./createTable.js');
const Messages = require('./models/messageModel');
const testProducts = require('./testProducts')
createTables();
const express = require('express');
const {randomRouter} =require('./routers/randomRouter')
const {Router} = express;
const app = express()
const httpServer = require('http').Server(app)
const io = require('socket.io')(httpServer)
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
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
        maxAge:600000
    }
})

)
app.use(compression())
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('views'));
app.use('/api',router)
app.use('/randomApi',randomRouter)
app.set('view engine', 'ejs');
app.set('views','./views')
app.set('socketio',io)
class ProductsApi{
    constructor(db,tableName){
        this.products = new Container(db,tableName);
    }
    getAll(){
        return this.products.getAll();
    }
    push(producto){
        this.products.save(producto);
    }
    update(id,producto){
        return this.products.update(id,producto);
    }
    delete(id){
        let product = this.products.getById(id)
        this.products.deleteById(id);
        return product;
    }
    get(id){
        return this.products.getById(id)
    }
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
const productsApi = new ProductsApi(knexMariaDB,'products');
const messagesApi = new MongoContainer(process.env.MONGO_URI,Messages)
router.use(express.json())
router.use(express.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }));


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
app.get('/',(req,res)=>{
    if(req.isAuthenticated()){
        res.render('form',{user:req.user.email});
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
io.on('connection', (socket) => {
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
    socket.on('new-message',async data => {
        if(!isNumeric(data.author.age) || data.text === "" || !validateEmail(data.author._id)){
            errorLogger.error('Error en el mensaje')
            io.sockets.emit('mailError');
            return
        }
        console.log("holaaaa")
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

app.post('/register', async (req, res) => {
    logger.info(`${req.route.path} ${req.method}`, 'register');
    let hash = bcrypt.hashSync(req.body.password,parseInt(process.env.BCRYPT_ROUNDS))
    const newUser = new User({
        email: req.body.email,
        password: hash,
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