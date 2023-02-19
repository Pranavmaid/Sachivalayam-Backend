const mongoose = require("mongoose");

const area = new mongoose.Schema({
  name: String,
});

const sachivalyam = new mongoose.Schema({
  name: String,
  sachivalyam_no: Number,
  areas: [area],
});

const ward = new mongoose.Schema({
  name: String,
  sachivalyam: [sachivalyam],
});

const Zone = mongoose.model(
  "Zone",
  new mongoose.Schema(
    {
      name: String,
      ward: [ward],
    },
    { timestamps: true }
  )
);

module.exports = Zone;
