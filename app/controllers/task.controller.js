const TaskService = require("../services/taskServices");
const send = require("../services/responseServices.js");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Zone = db.zone;

exports.getAllTasks = async (req, res) => {
  if (req.params.id == null) {
    send.response(res, "User Id Not Found", {}, 404);
  }
  try {
    let zone = await Zone.aggregate([
      {
        $match: {
          _id: req.user.zone,
        },
      },
      {
        $unwind: {
          path: "$ward",
        },
      },
      {
        $match: {
          "ward._id": req.user.ward,
        },
      },
      {
        $unwind: {
          path: "$ward.sachivalyam",
        },
      },
      {
        $match: {
          "ward.sachivalyam._id": req.user.sachivalyam,
        },
      },
      {
        $project: {
          zonename: "$name",
          wardname: "$ward.name",
          sachivalyamname: "$ward.sachivalyam.name",
        },
      },
    ]);

    req.user.ward = zone[0].wardname;
    req.user.zone = zone[0].zonename;
    req.user.sachivalyam = zone[0].sachivalyam;

    const Tasks = await TaskService.getAllTasks(req.params.id, req.role, req.user);
    send.response(res, "success", Tasks, 200);
  } catch (err) {
    send.response(res, err, [], 500);
  }
};

exports.getAllStatusTasks = async (req, res) => {
  if (req.params.id == null) {
    send.response(res, "User Id Not Found", {}, 404);
  }

  try {
    const status = ["Completed", "Ongoing", "In-review"];

    var Tasks = [];
    let zone = await Zone.aggregate([
      {
        $match: {
          _id: req.user.zone,
        },
      },
      {
        $unwind: {
          path: "$ward",
        },
      },
      {
        $match: {
          "ward._id": req.user.ward,
        },
      },
      {
        $unwind: {
          path: "$ward.sachivalyam",
        },
      },
      {
        $match: {
          "ward.sachivalyam._id": req.user.sachivalyam,
        },
      },
      {
        $project: {
          zonename: "$name",
          wardname: "$ward.name",
          sachivalyamname: "$ward.sachivalyam.name",
        },
      },
    ]);

    req.user.ward = zone[0].wardname;
    req.user.zone = zone[0].zonename;
    req.user.sachivalyam = zone[0].sachivalyam;

    if (req.query.taskStatus == "all") {
      Tasks = await TaskService.getAllTasks(req.params.id, req.role, req.user);
    } else {
      if (!status.includes(req.query.taskStatus)) {
        send.response(res, "Please enter a proper status value", Tasks, 301);
      }
      Tasks = await TaskService.getAllStatusTasks(
        req.params.id,
        req.role, 
        req.user,
        req.query.taskStatus
      );
    }

    if (Tasks.length <= 0) {
      send.response(res, "Data Not found", Tasks, 200);
    } else {
      send.response(res, "success", Tasks, 200);
    }
  } catch (err) {
    send.response(res, err, [], 500);
  }
};

exports.getTodaysTasks = async (req, res) => {
  if (req.params.id == null) {
    send.response(res, "User Id Not Found", {}, 404);
  }
  try {
    let zone = await Zone.aggregate([
      {
        $match: {
          _id: req.user.zone,
        },
      },
      {
        $unwind: {
          path: "$ward",
        },
      },
      {
        $match: {
          "ward._id": req.user.ward,
        },
      },
      {
        $unwind: {
          path: "$ward.sachivalyam",
        },
      },
      {
        $match: {
          "ward.sachivalyam._id": req.user.sachivalyam,
        },
      },
      {
        $project: {
          zonename: "$name",
          wardname: "$ward.name",
          sachivalyamname: "$ward.sachivalyam.name",
        },
      },
    ]);

    req.user.ward = zone[0].wardname;
    req.user.zone = zone[0].zonename;
    req.user.sachivalyam = zone[0].sachivalyam;
    
    const Tasks = await TaskService.getTodaysTasks(req.params.id, req.role, req.user);
    send.response(res, "success", Tasks, 200);
  } catch (err) {
    send.response(res, err, {}, 500);
  }
};

exports.getTaskName = async (req, res) => {
  try {
    const Tasks = await TaskService.getAllTaskNames();
    send.response(res, "success", Tasks, 200);
  } catch (err) {
    send.response(res, err, {}, 500);
  }
};

exports.createTask = async (req, res) => {
  if (req.body == null) {
    send.response(res, "No data found", {}, 404);
    return;
  }
  console.log("received add task request", req.body);
  if (req.body.before_image == null || req.body.before_image.length == 0) {
    send.response(res, "Please send before images", {}, 404);
    return;
  }

  var imageLink = [];
  if (typeof req.body.before_image == "object") {
    for (const iterator of req.body.before_image) {
      imageLink.push(
        `https://sachivalayam-backend.onrender.com/task_images/${iterator}`
      );
    }
  } else if (typeof req.body.before_image == "string") {
    imageLink.push(
      `https://sachivalayam-backend.onrender.com/task_images/${req.body.before_image}`
    );
  } else {
    send.response(res, "Before Image format not supported", {}, 401);
  }

  req.body.before_image = imageLink;

  let zone = await Zone.aggregate([
    {
      $match: {
        _id: req.user.zone,
      },
    },
    {
      $unwind: {
        path: "$ward",
      },
    },
    {
      $match: {
        "ward._id": req.user.ward,
      },
    },
    {
      $unwind: {
        path: "$ward.sachivalyam",
      },
    },
    {
      $match: {
        "ward.sachivalyam._id": req.user.sachivalyam,
      },
    },
    {
      $project: {
        zonename: "$name",
        wardname: "$ward.name",
        sachivalyamname: "$ward.sachivalyam.name",
      },
    },
  ]);

  req.body.ward = zone[0].wardname;
  req.body.zone = zone[0].zonename;
  req.body.sachivalyam = zone[0].sachivalyamname;

  try {
    const Task = await TaskService.createTask(req.body);
    send.response(res, "success", Task, 200);
  } catch (err) {
    send.response(res, err.message, {}, 500);
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const Task = await TaskService.getTaskById(req.params.id);
    send.response(res, "success", Task, 200);
  } catch (err) {
    send.response(res, err, [], 500);
  }
};

exports.updateTask = async (req, res) => {
  if (req.body == null) {
    send.response(res, "No data found", {}, 404);
    return;
  }
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      send.response(res, err, {}, 500);
      return;
    }

    Role.findOne(
      {
        _id: user.roles,
      },
      async (err, roles) => {
        if (err) {
          send.response(res, err, {}, 500);
          return;
        }

        if (roles.name === "sanitaryInspector") {
          try {
            const Task = await TaskService.updateTask(req.params.id, req.body);
            send.response(res, "success", Task, 200);
          } catch (err) {
            send.response(res, err, [], 500);
          }
        } else if (roles.name === "secretary") {
          console.log("received update task request", req.body);
          if (req.body.after_image == null || req.body.after_image.length == 0) {
            send.response(res, "Please send after images also", {}, 404);
            return;
          }
          var imageLink = [];
          if (typeof req.body.after_image == "object")
          {
            for (const iterator of req.body.after_image) {
              imageLink.push(
                `https://sachivalayam-backend.onrender.com/task_images/${iterator}`
              );
            }
          } else if(typeof req.body.after_image == "string") {
            imageLink.push(
              `https://sachivalayam-backend.onrender.com/task_images/${req.body.after_image}`
            );
          } else {
            send.response(res, "After Image format not supported", {}, 401);
          }

          req.body.after_image = imageLink;

          try {
            const Task = await TaskService.updateTask(req.params.id, req.body);
            send.response(res, "success", Task, 200);
          } catch (err) {
            send.response(res, err, [], 500);
          }
        } else {
          send.response(res, "Permission Denied, you cannot update task!", {}, 403);
        }
      }
    );
  });
};

exports.deleteTask = async (req, res) => {
  try {
    const Task = await TaskService.deleteTask(req.params.id);
    send.response(res, "success", Task, 200);
  } catch (err) {
    send.response(res, err, [], 500);
  }
};
