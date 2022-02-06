
require('dotenv').config()
const {ProductsDao,CartsDao} = require('./daos/ContainerCreator')
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

const products = ProductsDao;
const carts = CartsDao;
cartRouter.use(express.json());
cartRouter.use(express.urlencoded({ extended: true}));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const server = app.listen(PORT,() => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}   `)
});

server.on("error",error => console.log(`Error en el servidor ${error}`));

router.get('/products',async (req, res) => {
    let savedProducts = await products.getAll()
    res.send({statusCode:200,payload:savedProducts});
    
})
router.get('/products/:id',async (req, res) => {
    let id = req.params.id;
    let product = await products.getById(id);
    if(!product){
        res.send({"error":"No se encuentra el producto"})
        return;
    }
    res.send(product);
})
router.post('/products',async (req,res) =>{
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
    let newProduct = await products.save(product);
    res.send({statusCode:200,payload:newProduct});
})
router.put('/products/:id',async (req, res) => {
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
    let newProduct = await products.update(id,product)
    if(!newProduct){
        res.send({"error":"No se encuentra el producto"})
    }
    res.send({statusCode:200,payload:newProduct});
})
router.delete('/products/:id',async (req, res) => {
    if(!admin){
        res.send({ error : -1, description: "ruta 'products' método 'delete' no autorizado" });
        return
    }
    let id = req.params.id;
    if(!(await products.getById(id))){
        res.send({"error":"No se encuentra el producto"})
        return
    }
    let erasedProduct = await products.deleteById(id);
    res.send({statusCode:200,erasedProduct});
});

cartRouter.post('/',async (req,res)=>{
    const cart = {products:[]};
    newCart = await carts.save(cart);
    res.send({statusCode:200,newCart});

})
cartRouter.delete('/:id',async (req, res) => {
    let id = req.params.id;
    if(!(await carts.getById(id))){
        res.send({"error":"No se encuentra el carrito"})
    }
    let erasedCart = await carts.deleteById(id);
    res.send({statusCode:200,payload:erasedCart});
})
cartRouter.get('/:id/products',async (req, res)=>{
    let id = req.params.id;
    if(!carts.getById(id)){
        res.send({"error":"No se encuentra el carrito"})
    }
    let products = (await carts.getById(id)).products;
    res.send({statusCode:200,payload:products});
})
cartRouter.post('/:id/products/:productId',async (req, res) =>{
    let id = req.params.id;
    let productId = req.params.productId;
    if(!carts.getById(id)){
        res.send({"error":"No se encuentra el carrito"})
    }
    if(!products.getById(productId)){
        res.send({"error":"No se encuentra el producto"})
    }
    let oldCart = await carts.getById(id);
    let product = await products.getById(productId);
    const newCart = {...oldCart};
    
    
    if(!newCart.products){
        newCart.products = []
    }
    await newCart.products.push(product);
    await carts.update(id,newCart);
    res.send({statusCode:200,payload:await carts.getById(id)});
})
cartRouter.delete('/:id/products/:productId',async (req, res)=>{
    let id = req.params.id;
    let productId = req.params.productId;
    if(!carts.get(id)){
        return res.send({"error":"No se encuentra el carrito"})
        
    }
    if(!products.get(productId)){
        return res.send({"error":"No se encuentra el producto"})
       
    }
    let cart = await carts.get(id);
    let newCart = {...cart};
    if(!cart.products){
        return res.send({"error":"El carrito se encuentra vacio"})
    }
    newCart.products.forEach(async (element,index,array) =>{
        console.log(element._id,productId)
        if(String(element._id) === String(productId)){
            array.splice(index,1)
            await carts.update(id,newCart)
            return res.send({statusCode:200,payload:await carts.get(id)})
        }
        else{
            return res.send({"error":"No se encontro el producto"})
        }
    })
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