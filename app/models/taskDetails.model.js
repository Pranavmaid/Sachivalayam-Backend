const mongoose = require("mongoose");

const TaskDetails = mongoose.model(
  "TaskDetails",
  new mongoose.Schema(
    {
      task_name: { type: String, required: [true, "Please send a task name"] },
    },
    { timestamps: true }
  )
);

module.exports = TaskDetails;
