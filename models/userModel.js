const mongoose = require("mongoose");
const cart = require("./cartModel").schema;
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String
    },
    name: {
        type: String
    },
    adress: {
        type: String
    },
    age: {
        type: Number
    },
    telephone: {
        type: String
    },
    imgPath: {
        type: String
    },
    cart:{
        type: cart
    }
})

module.exports = User = mongoose.model("users", UserSchema);