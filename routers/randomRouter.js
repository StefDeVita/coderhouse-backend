const express = require('express');
const {fork} = require('child_process')
const {Router} = express;

const randomRouter = Router()

randomRouter.use(express.json())
randomRouter.use(express.urlencoded({ extended: true }))



randomRouter.get('/random',(req,res)=>{
    let cant = Number(req.query.quantity);
    if(!cant){
        cant = 10000000;
    }
    const calculated = fork('./forks/child.js')
    calculated.send({cant: cant})
    calculated.on('message',calc =>{
        res.render('numbers',{numbers:calc})
    })
    
})

module.exports = {randomRouter}