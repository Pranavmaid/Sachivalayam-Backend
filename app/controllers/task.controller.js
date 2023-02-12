const TaskService = require("../services/taskServices");
 
exports.getAllTasks = async (req, res) => {
  try {
    const Tasks = await TaskService.getAllTasks();
    res.json({ data: Tasks, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
exports.createTask = async (req, res) => {
  try {
    const Task = await TaskService.createTask(req.body);
    res.json({ data: Task, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
exports.getTaskById = async (req, res) => {
  try {
    const Task = await TaskService.getTaskById(req.params.id);
    res.json({ data: Task, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
exports.updateTask = async (req, res) => {
  try {
    const Task = await TaskService.updateTask(req.params.id, req.body);
    res.json({ data: Task, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
exports.deleteTask = async (req, res) => {
  try {
    const Task = await TaskService.deleteTask(req.params.id);
    res.json({ data: Task, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};