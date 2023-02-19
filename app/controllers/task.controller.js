const TaskService = require("../services/taskServices");
const send = require("../services/responseServices.js");

exports.getAllTasks = async (req, res) => {
  if (req.params.id == null) {
    send.response(res, "User Id Not Found", {}, 404);
  }
  try {
    const Tasks = await TaskService.getAllTasks(req.params.id);
    send.response(res, "success", Tasks, 200);
  } catch (err) {
    send.response(res, err, [], 500);
  }
};

exports.getTodaysTasks = async (req, res) => {
  if (req.params.id == null) {
    send.response(res, "User Id Not Found", {}, 404);
  }
  try {
    const Tasks = await TaskService.getTodaysTasks(req.params.id);
    send.response(res, "success", Tasks, 200);
  } catch (err) {
    send.response(res, err, {}, 500);
  }
};

exports.getTaskName = async (req, res) => {
  try {
    const Tasks = await TaskService.getAllTaskNames();
    send.response(res, "success", Tasks, 200);
  } catch (err) {
    send.response(res, err, {}, 500);
  }
};

exports.createTask = async (req, res) => {
  if (req.body == null) {
    send.response(res, "No data found", {}, 404);
    return;
  }
  if (req.body.before_image == null || req.body.before_image.length == 0) {
    send.response(res, "Please send before images", {}, 404);
    return;
  }
  try {
    const Task = await TaskService.createTask(req.body);
    send.response(res, "success", Task, 200);
  } catch (err) {
    send.response(res, err.message, {}, 500);
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
  if (req.body == null) {
    send.response(res, "No data found", {}, 404);
    return;
  }
  if (req.body.before_image == null || req.body.before_image.length == 0) {
    send.response(res, "Please send after images also", {}, 404);
    return;
  }
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
