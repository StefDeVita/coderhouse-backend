const {MongoContainer} = require('../containers/mongoContainer')
const ProductModel = require('../models/Products.js')


class ProductsDaoMongo extends MongoContainer {
    constructor(){
        super(process.env.MONGO_URI,ProductModel)
    }
}

module.exports = {ProductsDaoMongo}