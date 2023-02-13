const mongoose = require("mongoose");

const Task = mongoose.model(
  "Task",
  new mongoose.Schema({
    task_name: String,
    from_work_area: String,
    to_work_area: String,
    assigned_worker: Array,
    before_image: Array, 
    after_image: Array,
    assigned_by: String
  },{timestamps: true})
);

module.exports = Task;