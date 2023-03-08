const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const upload = require("../middlewares/fileUpload");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/user", [authJwt.verifyToken], controller.getAllUsers);

  app.get(
    "/api/user/worker",
    [authJwt.verifyToken, authJwt.checkRole],
    controller.getAllWorkers
  );

  app.post(
    "/api/user/worker",
    [authJwt.verifyToken, authJwt.checkRole],
    upload.excelUpload,
    controller.uploadBulkExcel
  );

  app.get("/api/user/:id", [authJwt.verifyToken], controller.getUserById);

  app.post("/api/user/worker/attendance", controller.getAllWorkersAttendance);

  app.post("/api/user", [authJwt.verifyToken], controller.createUser);

  app.put("/api/user/:id", [authJwt.verifyToken], controller.updateUser);

  app.delete("/api/user/:id", [authJwt.verifyToken], controller.deleteUser);
};
