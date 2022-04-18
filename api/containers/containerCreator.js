const {MessagesDaoSQL} = require('../daos/messagesDaoSQL')
const {ProductsDaoSQL} = require('../daos/productsDaoSQL')
const {MessagesDaoMongo} = require('../daos/messagesDaoMongo')
const {ProductsDaoMongo} = require('../daos/productsDaoMongo')

switch(process.env.STORAGE_MODE){
    case 'MONGO':
        module.exports = {ProductsDao: new ProductsDaoMongo(),MessagesDao:new MessagesDaoMongo()}
        break;
    case 'SQL':
        module.exports = {ProductsDao: new ProductsDaoSQL(),MessagesDao:new MessagesDaoSQL()}
        break;
    
    default:
        console.log("No storage mode specified");
}