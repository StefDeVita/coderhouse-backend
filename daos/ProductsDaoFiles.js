const {Container} = require('../containers/container.js')

class ProductsDaoFiles extends Container{
    constructor(){
        super('./products.json')
    }
}

module.exports = {ProductsDaoFiles}