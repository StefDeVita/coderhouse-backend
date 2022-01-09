const {Container} = require('./container.js')
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
class ProductsApi{
    constructor(path){
        this.products = new Container(__dirname + path);
    }
    getAll(){
        return this.products.getAll();
    }
    push(producto){
        let id = this.products.save(producto);
        return this.products.getById(id);
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
        console.log("hola")
        return true;
    }
    else
    {
        console.log(inputText)
        return false;
    }
}
const productsApi = new ProductsApi('/products.json');
const messagesApi = new ProductsApi('/messages.json');
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
    let products = productsApi.getAll();
    socket.emit('products',products)
    socket.emit('messages',messagesApi.getAll())
    socket.on('product',data =>{
        if(data.title === "" || data.thumbnail === "" || !isNumeric(data.price)){
            io.sockets.emit('error');
            return
        }
        productsApi.push(data);
        io.sockets.emit('products',products)
    } )
    socket.on('new-message',data => {
        if(data.message === "" || !validateEmail(data.author)){
            io.sockets.emit('mailError');
            return
        }
        messagesApi.push(data);
        io.sockets.emit('messages', messagesApi.getAll());
    });

});

app.get('/products',(req,res)=>{
    let products = productsApi.getAll()
    res.render('products',{products});
})