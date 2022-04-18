const {knexMariaDB} = require('./mariaDB.js');
const {knexSQLite} = require('./SQLite3.js');
const  createTables = async () =>{

if(! await knexSQLite.schema.hasTable('products')){
knexSQLite.schema.dropTableIfExists('products')   
.createTable('products',table =>{
    table.increments("id")
    table.string("title")
    table.integer("price")
    table.string("thumbnail")
}).then(() => console.log("SQL products table created"))
.catch((err) => console.log(err))
}
if(! await knexSQLite.schema.hasTable('messages')){
knexSQLite.schema.dropTableIfExists('messages')
.createTable('messages',table =>{
    table.json('author')
    table.string('text')
    
}).then(() => console.log("SQL messages table created"))
.catch((err) => console.log(err))
    }
}
module.exports = {
    createTables
}