
class ContainerSQL {
    constructor(knex,tableName) {
        this.knex = knex;
        this.tableName = tableName;
    }

    save(object) {
        this.knex(this.tableName).insert(object).then()
    }
    getAll() {
        try {
            let values = this.knex.select().table(this.tableName).then()
            return values
        } catch (error) {
            return {}
        }
        
        
    }
    deleteById(id) {
        this.knex(this.tableName)
        .where({id:id}).del();   
    }
    deleteAll() {
        this.knex(this.tableName).del()
        .where('id', '!=', 'null')
    }
    update(id, product) {
        this.knex(this.tableName).where({id:id})
        .update(product)
    }
    getById(id) {
        return this.knex(this.tableName).where({id:id})
    }
}
module.exports = {
    ContainerSQL
}