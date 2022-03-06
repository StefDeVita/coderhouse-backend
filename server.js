require('dotenv').config()
const {MongoContainer} = require('./mongoContainer')
const yargs = require('yargs/yargs')(process.argv.slice(2))
const passport = require('passport')
const passportConfig = require('./config/passport.js')
const bcrypt = require('bcrypt');
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
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

const argv = yargs.alias({
    p: 'port'
}).default({
    port:8080
}).argv

const PORT = argv.port
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

const server = httpServer.listen(PORT,() => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}   `)
});

server.on("error",error => console.log(`Error en el servidor ${error}`));
app.post('/products',(req, res)=>{
    newProduct = req.body
    if(newProduct.title === "" || newProduct.thumbnail === "" || !isNumeric(newProduct.price)){
        res.render('error');
        return
    }
    productsApi.push(req.body);
    res.redirect('/')
});

app.get('/goodbye',(req,res)=>{
    let name = req.session.name;
    req.session.destroy(err => console.log(err));
    res.render('goodbye',{name:name});
    
})
app.get('/logout',(req,res)=>{
    res.redirect('/goodbye')
})
app.get('/',(req,res)=>{
    if(req.isAuthenticated()){
        res.render('form',{user:req.user.email});
    }
    else{
        res.render('form')
    }
})
app.get('/login',(req,res)=>{
    res.render('form');
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
})

app.post('/register', async (req, res) => {
    let hash = bcrypt.hashSync(req.body.password,parseInt(process.env.BCRYPT_ROUNDS))
    const newUser = new User({
        email: req.body.email,
        password: hash,
    })
    const user = await User.findOne({email:req.body.email});
    if(user){
        res.render('signupError')
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
})

app.post('/login',passport.authenticate('login',{failureRedirect:'/signinError'}),(req,res)=>{
    res.redirect('/')
})


app.get('/info',(req,res)=>{
    res.render('info',{argv:argv, process:process,__dirname:__dirname})
})



