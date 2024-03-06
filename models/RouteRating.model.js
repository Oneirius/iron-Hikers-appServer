const { Schema, model } = require("mongoose");
const mongoose = require('mongoose');

const routeRatingSchema = new Schema(
  {
    //* TO-DO: REPLACE WITH USERID
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rooute: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
    score: { type: Number, min: 0, max: 5 },
  },
  {
    // Adds `createdAt` and `updatedAt` properties
    timestamps: true,
  }
);
