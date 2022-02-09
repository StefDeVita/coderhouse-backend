const { normalize, schema } = require('normalizr')

const author = new schema.Entity('authors')


const messageSchema = new schema.Entity('messages',{
    id: author
})




module.exports = messageSchema