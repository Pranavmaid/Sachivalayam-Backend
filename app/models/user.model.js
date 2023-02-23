const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      name: String,
      email: String,
      password: String,
      phone: String,
      ward: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Zone",
      },
      zone: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Zone",
      },
      sachivalyam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Zone",
      },
      gender: String,
      age: Number,
      supervisor: {
        type: mongoose.Schema.Types.ObjectId, //["secretary", "admin", "worker", "sanitaryInspector"]
        ref: "User",
      },
      workingSlots: { type: Array, default: [] },
      roles: {
        type: mongoose.Schema.Types.ObjectId, //["secretary", "admin", "worker", "sanitaryInspector"]
        ref: "Role",
      },
    },
    { timestamps: true }
  )
);

module.exports = User;
