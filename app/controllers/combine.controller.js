const UserService = require("../services/userServices");
const TaskService = require("../services/taskServices");
const send = require("../services/responseServices.js");

exports.getAddNewTaskDetails = async (req, res) => {
    try {
        const Workers = await UserService.getAllWorkersOfSupervisor(req.userId);
        const Tasks = await TaskService.getAllTaskNames();
        
        var data = {
            workers: Workers,
            tasks: Tasks,
        };
        send.response(res, "success", Users, 200);
      } catch (err) {
        send.response(res, err, [], 500);
      }
}