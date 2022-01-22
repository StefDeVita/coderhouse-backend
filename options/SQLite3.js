const knexSQLite = require('knex')({
    client : 'sqlite3',
    connection : {
        filename:"./db/messages.sqlite"
    },
    useNullAsDefault:true
})
module.exports = {
    knexSQLite
}