const {MongoContainer} = require('../containers/mongoContainer')
const productModel = require('../../models/productModel')

class ProductsDaoMongo extends MongoContainer {
    constructor() {
        super(process.env.MONGO_URI,productModel)
    }
}



module.exports = {ProductsDaoMongo}