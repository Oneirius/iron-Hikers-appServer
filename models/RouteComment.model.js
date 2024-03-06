const { Schema, model } = require("mongoose");
const mongoose = require('mongoose');

const routeCommentSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
    commentText: { type: String, required: [true, "Comment text is required"] },
    //* TO-DO: Add placeholder image
    images: { type: [String], default: [] },
  },
  {
    // Adds `createdAt` and `updatedAt` properties
    timestamps: true,
  }
);

const RouteComment = model("RouteComment", routeCommentSchema);

module.exports = RouteComment;
