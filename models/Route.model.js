const { Schema, model } = require("mongoose");
const mongoose = require('mongoose');

const routeSchema = new Schema({
  city: { type: String, required: [true, "City is required"] },
  distance: { type: Number, required: [true, "Distance is required"] },
  intensity: { type: String },
  description: { type: String, required: [true, "Description is required"] },
  startPoint: { type: String, required: [true, "Description is required"] },
  endPoint: { type: String, required: [true, "Description is required"] },

  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  routeComments: [{ type: mongoose.Schema.Types.ObjectId, ref: "RouteComment" }],
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "RouteRating" }],
});

const Route = model("Route", routeSchema);

module.exports = Route;
