require('dotenv').config()
const {MongoContainer} = require('./mongoContainer')
const {normalize} = require('normalizr')
const {Container} = require('./container.js')
const {knexMariaDB} = require('./options/mariaDB.js');
const messageSchema = require('./models/messageSchema')
const {knexSQLite} = require('./options/SQLite3.js');
const {createTables} = require('./createTable.js');
const Messages = require('./models/messageModel');
const testProducts = require('./testProducts')
createTables();
const express = require('express');
const PORT = 8080;
const ejs = require('ejs');
const {Router} = express;
const app = express()
const httpServer = require('http').Server(app)
const io = require('socket.io')(httpServer)
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
const router = Router();
app.use(express.static('views'));
app.use('/api',router)
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
app.get('/',(req,res)=>{
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