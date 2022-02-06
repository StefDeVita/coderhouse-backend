const {FireContainer} = require('../containers/fireContainer')


class ProductsDaoFirebase extends FireContainer{
    constructor(){
        super('Products');
    }
}

module.exports = {ProductsDaoFirebase}