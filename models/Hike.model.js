const { Schema, model } = require("mongoose");
const mongoose = require('mongoose');

const hikeSchema = new Schema({
  name: { type: String, required: [true, "Name is required"] },
  description: { type: String, required: [true, "Description is required"] },
  // *TO-DO: CHANGE TO ROUTE ID
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: [true, "Route is required"] },
  date: { type: String, required: [true, "Date is required"] },
  startTime: { type: String, required: [true, "Time is required"] },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  hikeComments: [{ type: mongoose.Schema.Types.ObjectId, ref: "HikeComment" }],
});

const Hike = model("Hike", hikeSchema);

module.exports = Hike;
