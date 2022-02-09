const {knexMariaDB} = require('./options/mariaDB.js');
const {knexSQLite} = require('./options/SQLite3.js');
const  createTables = () =>{
knexMariaDB.schema.dropTableIfExists('products')   
.createTable('products',table =>{
    table.increments("id")
    table.string("title")
    table.integer("price")
    table.string("thumbnail")
}).then(() => console.log("SQL products table created"))
.catch((err) => console.log(err))

knexSQLite.schema.dropTableIfExists('messages')
.createTable('messages',table =>{
    table.increments('id')
    table.string('author')
    table.string('text')
    table.string('date')
}).then(() => console.log("SQL messages table created"))
.catch((err) => console.log(err))
}
module.exports = {
    createTables
}