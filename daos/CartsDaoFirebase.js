const {FireContainer} = require('../containers/fireContainer')


class CartsDaoFirebase extends FireContainer{
    constructor(){
        super('Carts');
    }
}

module.exports = {CartsDaoFirebase}