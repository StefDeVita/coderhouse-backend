const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    author: [{
        _id:String,
        firstName:String,
        lastName:String,
        age:Number,
        alias:String,
        avatar:String,
        date:String

    }],
    text: String
})


module.exports = mongoose.model("Messages", messageSchema)