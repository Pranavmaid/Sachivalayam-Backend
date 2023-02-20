const {
  getAllTasks,
  getTodaysTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskName,
  getAllStatusTasks,
} = require("../controllers/task.controller");
const { getAddNewTaskDetails } = require("../controllers/combine.controller");
const { authJwt } = require("../middlewares");
const multer = require("multer");
const folderConfig = require("../config/folder.config");

const imageStorage = multer.diskStorage({
  // Destination to store image
  destination: `${folderConfig.TASK_FOLDER}`,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
    // file.originalname is name of the field (image)
  },
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    // if (!file.originalname.match(/\.(png|jpg)$/)) {
    //   // upload only png and jpg format
    //   return cb(new Error("Please upload a Image in .png or .jpg format"));
    // }
    cb(undefined, true);
  },
});

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/task/:id", [authJwt.verifyToken], getAllTasks);

  app.get(
    "/api/task_by_status/:id",
    [authJwt.verifyToken],
    getAllStatusTasks
  );

  //get todays task and task status count
  app.get("/api/todays_task/:id", [authJwt.verifyToken], getTodaysTasks);

  //get todays task and task status count
  app.get("/api/task_names", [authJwt.verifyToken], getTaskName);

  /* imageUpload.array("images", 30), contains max no of images and key to find images file location
    In bellow example i have put max no of images to 30 and key as "images" to upload images key needs 
    to same for backend and frontend*/
  app.post(
    "/api/task",
    [authJwt.verifyToken],
    imageUpload.array(
      `${folderConfig.TASK_IMAGE_KEY}`,
      folderConfig.TASK_MAX_IMAGES
    ),
    createTask
  );

  app.put(
    "/api/task/:id",
    [authJwt.verifyToken],
    imageUpload.array(
      `${folderConfig.TASK_IMAGE_KEY}`,
      folderConfig.TASK_MAX_IMAGES
    ),
    updateTask
  );

  app.get("/api/task_by_id/:id", [authJwt.verifyToken], getTaskById);

  app.get(
    "/api/getAddNewTaskDetails",
    [authJwt.verifyToken],
    getAddNewTaskDetails
  );

  app.delete("/api/task/:id", [authJwt.verifyToken], deleteTask);
};
