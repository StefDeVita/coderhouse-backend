const {Container} = require('../containers/container.js')

class CartsDaoFiles extends Container{
    constructor(){
        super('./carts.json')
    }
}

module.exports = {CartsDaoFiles}