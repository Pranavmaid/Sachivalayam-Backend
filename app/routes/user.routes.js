const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const multer = require("multer");
const folderConfig = require("../config/folder.config");

const excelStorage = multer.diskStorage({
  // Destination to store image
  destination: `${folderConfig.EXCEL_FOLDER}`,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
    // file.originalname is name of the field (image)
  },
});

const excelUpload = multer({
  storage: excelStorage,
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

  app.get("/api/user", [authJwt.verifyToken], controller.getAllUsers);

  app.get("/api/user/worker", [authJwt.verifyToken, authJwt.checkRole], controller.getAllWorkers);

  app.post(
    "/api/user/worker",
    [authJwt.verifyToken],
    excelUpload.array(
      `${folderConfig.WORKER_EXCEL_KEY}`,
      folderConfig.WORKER_MAX_EXCEL
    ),
    controller.getAllWorkers
  );

  app.get("/api/user/:id", [authJwt.verifyToken], controller.getUserById);

  app.post("/api/user", [authJwt.verifyToken], controller.createUser);

  app.put("/api/user/:id", [authJwt.verifyToken], controller.updateUser);

  app.delete("/api/user/:id", [authJwt.verifyToken], controller.deleteUser);
};
