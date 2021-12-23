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
        this.productos.update(id,producto);
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
    console.log(producto)
    res.send(producto);
})
router.post('/productos',(req,res) =>{
    let producto = req.body;
    if(!isNumeric(producto.price)){
        res.send("Ingrese un precio válido")
        return;
    }
    let nuevoProducto = productos.push(producto);
    res.send(nuevoProducto);
})
router.put('/productos/:id',(req, res) => {
    let id = req.params.id;
    let producto = req.body;
    let nuevoProducto = productos.update(id,producto)
    res.send(nuevoProducto);
})
router.delete('/productos/:id',(req, res) => {
    let id = req.params.id;
    if(!productos.get(id)){
        res.send("No se encuentra el producto")
    }
    productos.delete(id)
    res.send("Producto borrado exitosamente")
})