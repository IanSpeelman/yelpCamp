const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const CampgroundsSchema = new Schema({
      _id: String,
      title: String,
      price: Number,
      description: String,
      location: String,
      image: String
})

module.exports = mongoose.model("Campground", CampgroundsSchema)