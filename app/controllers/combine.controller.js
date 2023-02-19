const UserService = require("../services/userServices");
const TaskService = require("../services/taskServices");
const ZoneService = require("../services/zoneServices");
const send = require("../services/responseServices.js");

exports.getAddNewTaskDetails = async (req, res) => {
  try {
    const Workers = await UserService.getAllWorkersOfSupervisor(req.userId);
    const Tasks = await TaskService.getAllTaskNames();
    const WorkArea = await ZoneService.getAssignedWorkAreas(req.userId);
    var workAreaList = [];
    if (WorkArea.length > 0) {
      workAreaList = WorkArea[0].workArea;
    }

    var data = {
      workers: Workers,
      tasks: Tasks,
      workArea: workAreaList,
    };
    send.response(res, "success", data, 200);
  } catch (err) {
    send.response(res, err, [], 500);
  }
};
