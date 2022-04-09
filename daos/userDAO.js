const {MongoContainer} = require('../containers/mongoContainer');
const User = require('../models/userModel')


class UserDao extends MongoContainer {
    constructor(){
        super(process.env.MONGO_URI,User)
    }
    async getByEmail(email){
        let result = await this.model.find({email:email}).exec()
        if(!result){
             return null;
        }
        return result
    }
}
const users = new UserDao()

module.exports = users