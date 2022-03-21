const {MongoContainer} = require('../containers/mongoContainer')
const CartModel = require('../models/Carts')

class CartsDaoMongo extends MongoContainer {
    constructor(){
        super(process.env.MONGO_URI,CartModel)
    }
}

module.exports = {CartsDaoMongo}