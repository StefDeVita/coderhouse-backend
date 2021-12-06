const {Contenedor} = require('./contenedor.js')
const express = require('express');
const PORT = 8080;


const app = express();

const server = app.listen(PORT,() => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}   `)
});

server.on("error",error => console.log(`Error en el servidor ${error}`))
const container = new Contenedor('productos.json')
app.get('/productos',(req, res) => {
    res.send(container.getAll())
})
app.get('/productoRandom',(req, res) => {
    let products = container.getAll()
    res.send(products[Math.floor(Math.random()*products.length)])
})