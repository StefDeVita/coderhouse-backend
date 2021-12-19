const {Contenedor} = require('./contenedor.js')
const express = require('express');
const PORT = 8080;
const {Router} = express;

const app = express();
const router = Router();
app.use(express.static('public'));
app.use('/api',router)
class ApiProductos{
    constructor(){
        this.productos = [];
        this.id = 0;
    }
    getAll(){
        return this.productos;
    }
    push(producto){
        const nuevoProducto = ({...producto,id:this.id});
        this.productos.push(nuevoProducto);
        this.id++;
        return nuevoProducto;
    }
    update(id,producto){
        let productoACambiar = {};
        this.productos.forEach(p => {
            if(id == p.id){
                productoACambiar = p;
            }
        });
        const nuevoProducto = {...producto,id:productoACambiar.id}
        this.delete(productoACambiar.id);
        this.productos.push(nuevoProducto)
        return nuevoProducto;
    }
    delete(id){
        this.productos.forEach(p => {
            if(id === p.id){
                this.productos.splice(this.productos.indexOf(p),1)
                return p;
            }
        });
    }
    get(id){
        let productoADevolver = {};
        this.productos.forEach(producto => {
            if(id == producto.id){
                productoADevolver = producto;
            }
        });
        if(productoADevolver === {}){
            return {error:'No se encuentra el producto' }
        }
        return productoADevolver
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
    res.send(producto);
})
router.post('/productos',(req,res) =>{
    let producto = req.body;
    let id = productos.push(producto);
    res.end(JSON.stringify(id))
})
router.put('/productos/:id',(req, res) => {
    let id = req.params.id;
    let producto = req.body;
    let nuevoProducto = productos.update(id,producto)
    res.send(nuevoProducto);
})
router.delete('/productos/:id',(req, res) => {
    let id = req.params.id;
    res.send(productos.delete(id))
})