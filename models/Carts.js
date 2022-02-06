const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const schema = new mongoose.Schema(
  {
    products: [{
      timestamp: Date,
      title: String,
      price: Number,
      thumbnail: String,
      description: String,
      stock: Number,
      code: String,
    }],
    timestamp: { type: Date, default: Date.now() }
  },
  { versionKey: false, timestamps: true }
);
module.exports = mongoose.model("carts", schema);