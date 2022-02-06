const {CartsDaoFiles} = require('./CartsDaoFiles')
const {ProductsDaoFiles} = require('./ProductsDaoFiles')
const {CartsDaoMongo} = require('./CartsDaoMongo')
const {ProductsDaoMongo} = require('./ProductsDaoMongo')
const {CartsDaoFirebase} = require('./CartsDaoFirebase')
const {ProductsDaoFirebase} = require('./ProductsDaoFirebase')

switch(process.env.STORAGE_MODE){
    case 'MONGO':
        module.exports = {ProductsDao: new ProductsDaoMongo(),CartsDao:new CartsDaoMongo()}
        break;
    case 'FIRE':
        module.exports = {ProductsDao: new ProductsDaoFirebase(),CartsDao:new CartsDaoFirebase()}
        break;
    case 'FILES':
        module.exports = {ProductsDao: new ProductsDaoFiles(),CartsDao:new CartsDaoFiles()}
        break;
    default:
        console.log("No storage mode specified");
}