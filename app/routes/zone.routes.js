const { authJwt } = require("../middlewares");
const controller = require("../controllers/zone.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/zone", [authJwt.verifyToken], controller.getAllZones);

  app.post("/api/zone", [authJwt.verifyToken], controller.createZone);

  app.get("api/zone/:id", [authJwt.verifyToken], controller.getZoneById);

  app.put("api/zone/:id", [authJwt.verifyToken], controller.updateZone);

  app.delete("api/zone/:id", [authJwt.verifyToken], controller.deleteZone);
};
