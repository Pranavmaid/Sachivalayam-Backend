const {
  getAllTasks,
  getTodaysTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskName,
  getAllStatusTasks,
  getAllTaskStatusForPortal,
  getBarGraphData,
  getAllTaskData,
  getPieGraphData,
} = require("../controllers/task.controller");
const { getAddNewTaskDetails } = require("../controllers/combine.controller");
const { authJwt } = require("../middlewares");
const upload = require("../middlewares/fileUpload");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/task/:id",
    [authJwt.verifyToken, authJwt.checkRole],
    getAllTasks
  );

  app.get(
    "/api/task_by_status/:id",
    [authJwt.verifyToken, authJwt.checkRole],
    getAllStatusTasks
  );

  //get todays task and task status count
  app.get(
    "/api/todays_task/:id",
    [authJwt.verifyToken, authJwt.checkRole],
    getTodaysTasks
  );

  //get todays task and task status count
  app.get("/api/task_names", [authJwt.verifyToken], getTaskName);

  /* imageUpload.array("images", 30), contains max no of images and key to find images file location
    In bellow example i have put max no of images to 30 and key as "images" to upload images key needs 
    to same for backend and frontend*/
  app.post(
    "/api/task",
    [authJwt.verifyToken, authJwt.checkRole],
    upload.imageUpload,
    createTask
  );

  app.put(
    "/api/task/:id",
    [authJwt.verifyToken, authJwt.checkRole],
    upload.imageUpload,
    updateTask
  );

  //get all task status count
  app.get(
    "/api/task_status_count",
    // [authJwt.verifyToken],
    getAllTaskStatusForPortal
  );

  //get all tasks
  app.post(
    "/api/task_data",
    // [authJwt.verifyToken],
    getAllTaskData
  );

  //get Bar graph Data
  app.post(
    "/api/task_BarGraph",
    // [authJwt.verifyToken],
    getBarGraphData
  );

  //get Pie graph Data
  app.post(
    "/api/task_PieGraph",
    // [authJwt.verifyToken],
    getPieGraphData
  );

  app.get("/api/task_by_id/:id", [authJwt.verifyToken], getTaskById);

  app.get(
    "/api/getAddNewTaskDetails",
    [authJwt.verifyToken],
    getAddNewTaskDetails
  );

  app.delete("/api/task/:id", [authJwt.verifyToken], deleteTask);
};
