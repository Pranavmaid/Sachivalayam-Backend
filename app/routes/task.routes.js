const {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");
const { authJwt } = require("../middlewares");
 
module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        "/api/task",
        [authJwt.verifyToken],
        getAllTasks
    );
    
    app.post(
        "/api/task",
        [authJwt.verifyToken],
        createTask
    );

    app.get(
        "api/task/:id",
        [authJwt.verifyToken],
        getTaskById
    );

    app.put(
        "api/task/:id",
        [authJwt.verifyToken],
        updateTask
    );

    app.delete(
        "api/task/:id",
        [authJwt.verifyToken],
        deleteTask
    );
};