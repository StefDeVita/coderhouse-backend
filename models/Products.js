const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    timestamp: { type: Date, default: Date.now() },
    price: {
      type: Number,
      require: true,
    },
    thumbnail: {
      type: String,
      require: true,
    },
    description: {
        type: String,
        require: true,
      },
    stock: {
        type: Number,
        require: true,
      },
    code: {
        type: String,
        require: true,
      },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("products", schema);