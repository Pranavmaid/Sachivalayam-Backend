const TaskModel = require("../models/task.model");

exports.getAllTasks = async () => {
  return await TaskModel.find();
};

exports.createTask = async (task) => {
  return await TaskModel.create(task);
};
exports.getTaskById = async (id) => {
  return await TaskModel.findById(id);
};

exports.updateTask = async (id, task) => {
  return await TaskModel.findByIdAndUpdate(id, task);
};

exports.deleteTask = async (id) => {
  return await TaskModel.findByIdAndDelete(id);
};

exports.getUserTaskCount = async (id) => {
  return await TaskModel.findByIdAndDelete(id);
};
