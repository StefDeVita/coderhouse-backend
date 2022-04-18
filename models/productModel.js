const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title:String,
    price:Number,
    thumbnail:String
})


module.exports = mongoose.model("Products", productSchema)