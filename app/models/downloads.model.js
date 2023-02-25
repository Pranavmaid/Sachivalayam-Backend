const mongoose = require("mongoose");

const Downloads = mongoose.model(
  "downloads",
  new mongoose.Schema(
    {
      name: String,
      link: String,
    },
    { timestamps: true }
  )
);

module.exports = Downloads;
