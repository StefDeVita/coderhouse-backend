const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const schema = new mongoose.Schema(
  { userId : {type: mongoose.Schema.ObjectId},
    products: [{
      timestamp: Date,
      title: String,
      price: Number,
      thumbnail: String,
      description: String,
      stock: Number,
      code: String,
      amount: Number
    }],
    timestamp: { type: Date, default: Date.now() },
    total: Number
  },
  { versionKey: false, timestamps: true }
);
module.exports = mongoose.model("carts", schema) , schema;