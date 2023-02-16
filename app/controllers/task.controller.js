const TaskService = require("../services/taskServices");
const send = require("../services/responseServices.js");

exports.getAllTasks = async (req, res) => {
  try {
    const Tasks = await TaskService.getAllTasks();
    send.response(res, "success", Tasks, 200);
  } catch (err) {
    send.response(res, err, [], 500);
  }
};

exports.createTask = async (req, res) => {
  try {
    const Task = await TaskService.createTask(req.body);
    send.response(res, "success", Task, 200);
  } catch (err) {
    send.response(res, err, [], 500);
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const Task = await TaskService.getTaskById(req.params.id);
    send.response(res, "success", Task, 200);
  } catch (err) {
    send.response(res, err, [], 500);
  }
};

exports.updateTask = async (req, res) => {
  try {
    const Task = await TaskService.updateTask(req.params.id, req.body);
    send.response(res, "success", Task, 200);
  } catch (err) {
    send.response(res, err, [], 500);
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const Task = await TaskService.deleteTask(req.params.id);
    send.response(res, "success", Task, 200);
  } catch (err) {
    send.response(res, err, [], 500);
  }
};
