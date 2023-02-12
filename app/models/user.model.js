const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    ward: String,
    zone: String,
    sachivalyam: String,
    gender: String,
    age: Number,
    workingSlots: { type: Array, default: [] },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
);

module.exports = User;