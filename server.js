const {Container} = require('./container.js')
const express = require('express');
const PORT = process.env.PORT || 8080;
let admin = true;
const {Router} = express;
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
const app = express();
const router = Router();
const cartRouter = new Router()
app.use(express.static('public'));
app.use('/api',router);
app.use('/cart',cartRouter);

class ProductsApi{
    constructor(path){
        this.products = new Container(__dirname + path);
    }
    getAll(){
        return this.products.getAll();
    }
    push(product){
        let id = this.products.save(product);
        return this.products.getById(id);
    }
    update(id,product){
        return this.products.update(id,product);
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

const products = new ProductsApi('/products.json');
const carts = new ProductsApi('/carts.json');
cartRouter.use(express.json());
cartRouter.use(express.urlencoded({ extended: true}));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const server = app.listen(PORT,() => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}   `)
});

server.on("error",error => console.log(`Error en el servidor ${error}`));

router.get('/products',(req, res) => {
    res.send(products.getAll());
    
})
router.get('/products/:id',(req, res) => {
    let id = req.params.id;
    let product = products.get(id);
    if(!product){
        res.send({"error":"No se encuentra el producto"})
        return;
    }
    res.send(product);
})
router.post('/products',(req,res) =>{
    if(!admin){
        res.send({ error : -1, description: "ruta 'products' método 'post' no autorizado" });
        return
    }
    let product = req.body;
    if(!isNumeric(product.price) || !isNumeric(product.stock)){
        res.send({"error":"Ingrese un precio o stock válido"})
        return;
    }
    product.price = Number(product.price);
    product.stock = Number(product.stock);
    let newProduct = products.push(product);
    res.send(newProduct);
})
router.put('/products/:id',(req, res) => {
    if(!admin){
        res.send({ error : -1, description: "ruta 'products' método 'put' no autorizado" });
        return
    }
    let id = req.params.id;
    let product = req.body;
    if(!isNumeric(product.price) || !isNumeric(product.stock)){
        res.send({"error":"Ingrese un  o stock válido"})
        return;
    }
    product.price = Number(product.price);
    product.stock = Number(product.stock);
    let newProduct = products.update(id,product)
    if(!newProduct){
        res.send({"error":"No se encuentra el producto"})
    }
    res.send(newProduct);
})
router.delete('/products/:id',(req, res) => {
    if(!admin){
        res.send({ error : -1, description: "ruta 'products' método 'delete' no autorizado" });
        return
    }
    let id = req.params.id;
    if(!products.get(id)){
        res.send({"error":"No se encuentra el producto"})
    }
    let erasedProduct = products.delete(id);
    res.send(erasedProduct);
});

cartRouter.post('/',(req,res)=>{
    const cart = {};
    newCart = carts.push(cart);
    res.send(newCart);

})
cartRouter.delete('/:id',(req, res) => {
    let id = req.params.id;
    if(!carts.get(id)){
        res.send({"error":"No se encuentra el carrito"})
    }
    let erasedCart = carts.delete(id);
    res.send(erasedCart);
})
cartRouter.get('/:id/products',(req, res)=>{
    let id = req.params.id;
    if(!carts.get(id)){
        res.send({"error":"No se encuentra el carrito"})
    }
    let products = carts.get(id).products;
    res.send(products);
})
cartRouter.post('/:id/products/:productId',(req, res) =>{
    let id = req.params.id;
    let productId = req.params.productId;
    if(!carts.get(id)){
        res.send({"error":"No se encuentra el carrito"})
    }
    if(!products.get(productId)){
        res.send({"error":"No se encuentra el producto"})
    }
    let cart = carts.get(id);
    let product = products.get(productId);
    let newCart = {...cart};
    if(!newCart.products){
        newCart.products = []
    }
    newCart.products.push(product);
    carts.update(id,newCart);
    res.send(carts.get(id));
})
cartRouter.delete('/:id/products/:productId',(req, res)=>{
    let id = req.params.id;
    let productId = req.params.productId;
    if(!carts.get(id)){
        res.send({"error":"No se encuentra el carrito"})
        return
    }
    if(!products.get(productId)){
        res.send({"error":"No se encuentra el producto"})
        return
    }
    let cart = carts.get(id);
    let newCart = {...cart};
    if(!cart.products){
        res.send({"error":"El carrito se encuentra vacio"})
        return
    }
    newCart.products.forEach((element,index,array) =>{
        if(Number(element.id) === Number(productId)){
            console.log("casacacaca")
            array.splice(index,1)
            carts.update(id,newCart)
            res.send(carts.get(id))
            return
        }
    })
    res.send({"error":"No se encontro el producto"})
})
app.get('*', function(req, res) {
    res.send({ error : -2, descripcion: `ruta ${req.path} método 'get' no implementada`})
  });
app.post('*', function(req, res) {
    res.send({ error : -2, descripcion: `ruta ${req.path} método 'post' no implementada`})
  });  
app.delete('*', function(req, res) {
    res.send({ error : -2, descripcion: `ruta ${req.path} método 'delete' no implementada`})
  });  
app.put('*', function(req, res) {
    res.send({ error : -2, descripcion: `ruta ${req.path} método 'put' no implementada`})
  });