const mongoose = require("mongoose");

const Task = mongoose.model(
  "Task",
  new mongoose.Schema(
    {
      task_name: { type: String, required: [true, "Please send a task name"] },
      task_status: {
        type: String,
        required: [true, "Please send a task status"],
      }, //Ongoing,In-review,Completed
      from_work_area: {
        type: String,
        required: [true, "Please send from work area"],
      },
      to_work_area: {
        type: String,
        required: [true, "Please send to work area"],
      },
      assigned_worker: {
        type: Array,
        required: [true, "Please send assigned worker"],
      },
      before_image: Array,
      after_image: Array,
      assigned_by: {
        type: String,
        required: [true, "Please send assigned by name"],
      },
      assigners_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please send assigner id"],
      },
      ward: String,
      zone: String,
      sachivalyam: String,
    },
    { timestamps: true }
  )
);

module.exports = Task;
