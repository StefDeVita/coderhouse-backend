const {Contenedor} = require('./contenedor.js')
const express = require('express');
const PORT = 8080;
const {Router} = express;
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
const app = express();
const router = Router();
app.use(express.static('public'));
app.use('/api',router)
class ApiProductos{
    constructor(){
        this.productos = new Contenedor(__dirname + '/productos.json');
    }
    getAll(){
        return this.productos.getAll();
    }
    push(producto){
        let id = this.productos.save(producto);
        return this.productos.getById(id);
    }
    update(id,producto){
        return this.productos.update(id,producto);
    }
    delete(id){
        let producto = this.productos.getById(id)
        this.productos.deleteById(id);
        return producto;
    }
    get(id){
        return this.productos.getById(id)
    }
}

const productos = new ApiProductos();
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

const server = app.listen(PORT,() => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}   `)
});

server.on("error",error => console.log(`Error en el servidor ${error}`));

router.get('/productos',(req, res) => {
    res.send(productos.getAll());
    
})
router.get('/productos/:id',(req, res) => {
    let id = req.params.id;
    let producto = productos.get(id);
    if(!producto){
        res.send({"error":"No se encuentra el producto"})
        return;
    }
    res.send(producto);
})
router.post('/productos',(req,res) =>{
    let producto = req.body;
    if(!isNumeric(producto.price)){
        res.send({"error":"Ingrese un precio valido"})
        return;
    }
    producto.price = Number(producto.price);
    let nuevoProducto = productos.push(producto);
    res.send(nuevoProducto);
})
router.put('/productos/:id',(req, res) => {
    let id = req.params.id;
    let producto = req.body;
    if(!isNumeric(producto.price)){
        res.send({"error":"Ingrese un precio valido"})
        return;
    }
    producto.price = Number(producto.price);
    let nuevoProducto = productos.update(id,producto)
    if(!nuevoProducto){
        res.send({"error":"No se encuentra el producto"})
    }
    res.send(nuevoProducto);
})
router.delete('/productos/:id',(req, res) => {
    let id = req.params.id;
    if(!productos.get(id)){
        res.send({"error":"No se encuentra el producto"})
    }
    let productoBorrado = productos.delete(id);
    res.send(productoBorrado);
})