const { Schema, model } = require("mongoose");
const mongoose = require('mongoose');

const hikeCommentSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    hike: { type: mongoose.Schema.Types.ObjectId, ref: "Hike" },
    textBody: { type: String, required: [true, "Comment text is required"] },
  },
  {
    // Adds `createdAt` and `updatedAt` properties
    timestamps: true,
  }
);

const HikeComment = model("HikeComment", hikeCommentSchema);

module.exports = HikeComment;
