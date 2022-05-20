const {MongoContainer} = require('../containers/mongoContainer')
const messageModel = require('../../models/messageModel')

class MessagesDaoMongo extends MongoContainer {
    constructor() {
        super(process.env.MONGO_URI,messageModel)
    }
}



module.exports = {MessagesDaoMongo}