const express = require('express');
const {Router} = express
const cartModel = require('../models/cartModel')
const {MongoContainer} = require('../containers/mongoContainer')

const cartRouter = new Router()
cartRouter.use(express.json());
cartRouter.use(express.urlencoded({ extended: true}));
const carts = new MongoContainer(process.env.MONGO_URI,cartModel)
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

module.exports = {cartRouter,carts}