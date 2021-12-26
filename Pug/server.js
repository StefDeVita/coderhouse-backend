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
app.set('view engine', 'pug');
app.set('views','./views')
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

const productsApi = new ApiProductos();
router.use(express.json())
router.use(express.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }));

const server = app.listen(PORT,() => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}   `)
});

server.on("error",error => console.log(`Error en el servidor ${error}`));
app.post('/productos',(req, res)=>{
    console.log(req.body);
    productsApi.push(req.body);
    
    res.redirect('/')
});
app.get('/',(req,res)=>{
    res.render('form');
})
app.get('/productos',(req,res)=>{
    let products = productsApi.getAll()
    res.render('table',{products});
})