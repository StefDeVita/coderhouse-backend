const express = require('express');
const Router = require('koa-router')

const apiRouter = new Router({
    prefix:'/api'
});


apiRouter.get('/products-test',(req,res) =>{
    res.render('testProducts',{products:testProducts})
    logger.info(`${req.route.path} ${req.method}`, 'products-test');
})


module.exports = {apiRouter};