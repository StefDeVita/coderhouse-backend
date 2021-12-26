const {Container} = require('./container.js')
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
class ProductsApi{
    constructor(){
        this.products = new Container(__dirname + '/products.json');
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

const productsApi = new ProductsApi();
router.use(express.json())
router.use(express.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }));

const server = app.listen(PORT,() => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}   `)
});

server.on("error",error => console.log(`Error en el servidor ${error}`));
app.post('/products',(req, res)=>{
    newProduct = req.body
    if(newProduct.title === "" || newProduct.thumbnail === "" || !isNumeric(newProduct.price)){
        res.render('error');
        return;
    }
    productsApi.push(newProduct);
    
    res.redirect('/')
});
app.get('/',(req,res)=>{
    res.render('form');
})
app.get('/products',(req,res)=>{
    let products = productsApi.getAll()
    res.render('table',{products});
})