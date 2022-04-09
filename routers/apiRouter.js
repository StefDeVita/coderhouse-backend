const express = require('express');
const {Router} = express

const apiRouter = Router();

apiRouter.use(express.json())
apiRouter.use(express.urlencoded({ extended: true }))

apiRouter.get('/products-test',(req,res) =>{
    res.render('testProducts',{products:testProducts})
    logger.info(`${req.route.path} ${req.method}`, 'products-test');
})


module.exports = {apiRouter};