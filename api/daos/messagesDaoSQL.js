const {knexSQLite} = require('../../options/SQLite3.js')
const {ContainerSQL} = require('../containers/container')

class MessagesDaoSQL extends ContainerSQL {
    constructor(){
        super(knexSQLite,'messages')
    }
    save(object) {
        object.author = JSON.stringify(object.author)
        this.knex(this.tableName).insert(object).then()
    }
    async getAll() {
        try {
            const values = await this.knex.select().table(this.tableName)
            values.forEach(value => {
                value.author = JSON.parse(value.author)
            });
            return values
        } catch (error) {
            return {}
        }
        
        
    }
}


module.exports = {MessagesDaoSQL}