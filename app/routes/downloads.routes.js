const { authJwt } = require("../middlewares");
const controller = require("../controllers/downloads.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/getdownloadlink",
    [authJwt.verifyToken],
    controller.getDownloadById
  );

  app.post(
    "/api/download",
    [authJwt.verifyToken],
    controller.createDownloadsFile
  );

  app.put(
    "/api/download/:id",
    [authJwt.verifyToken],
    controller.updateDownloadFile
  );

  app.delete(
    "/api/download/:id",
    [authJwt.verifyToken],
    controller.deleteDownload
  );
};
