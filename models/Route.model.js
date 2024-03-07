const { Schema, model } = require("mongoose");
const mongoose = require('mongoose');

const routeSchema = new Schema({
  name: {type: String, required: [true, "Name is required"]},
  city: { type: String, required: [true, "City is required"] },
  length: { type: Number, required: [true, "Length is required"] },
  duration: {type: String, required: [true, "Durtion is required"]},
  intensity: { type: String },
  type: {type: String},
  description: { type: String, required: [true, "Description is required"] },
  map: {type: String},
  image: {type: String},
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  routeComments: [{ type: mongoose.Schema.Types.ObjectId, ref: "RouteComment" }],
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "RouteRating" }],
});

const Route = model("Route", routeSchema);

module.exports = Route;
