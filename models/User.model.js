const { Schema, model } = require("mongoose");
const mongoose = require('mongoose');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    createdRoutes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Route" }],
    createdHikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hike" }],
    ratingsGiven: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
    routeComments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "RouteComment" },
    ],
    hikeComments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "HikeComment" },
    ],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
