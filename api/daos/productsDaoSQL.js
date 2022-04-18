const {knexSQLite} = require('../../options/SQLite3.js')
const {ContainerSQL} = require('../containers/container')

class ProductsDaoSQL extends ContainerSQL {
    constructor(){
        super(knexSQLite,'products')
    }
}


module.exports = {ProductsDaoSQL}