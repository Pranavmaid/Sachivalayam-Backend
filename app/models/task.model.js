const mongoose = require("mongoose");

const Task = mongoose.model(
  "Task",
  new mongoose.Schema({
    taskname: String,
    work_area: String,
    assigned_worker: Array,
    before_image: Array, 
    after_image: Array,
    assigned_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
  })
);

module.exports = Task;