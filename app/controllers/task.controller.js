const TaskService = require("../services/taskServices");
const send = require("../services/responseServices.js");
const config = require("../config/auth.config.js");
const folderConfig = require("../config/folder.config.js");
const { zoneExtract } = require("../middlewares");
const db = require("../models");
const Zone = db.zone;

exports.getAllTasks = async (req, res) => {
  if (req.params.id == null) {
    send.response(res, "User Id Not Found", {}, 404);
    return;
  }
  try {
    let zone = await zoneExtract.extractWardZoneSachivalayamName(req, res);
    if (zone.length <= 0) {
      send.response(res, "Zone Not found", [], 404);
      return;
    }

    req.user.ward = zone[0].wardname;
    req.user.zone = zone[0].zonename;
    req.user.sachivalyam = zone[0].sachivalyam;

    const Tasks = await TaskService.getAllTasks(
      req.params.id,
      req.role,
      req.user
    );
    send.response(res, "success", Tasks, 200);
    return;
  } catch (err) {
    send.response(res, err, [], 500);
    return;
  }
};

exports.getAllStatusTasks = async (req, res) => {
  if (req.params.id == null) {
    send.response(res, "User Id Not Found", {}, 404);
    return;
  }

  try {
    const status = ["Completed", "Ongoing", "In-review"];

    var Tasks = [];

    let zone = await zoneExtract.extractWardZoneSachivalayamName(req, res);

    if (zone.length <= 0) {
      send.response(res, "Zone Not found", [], 404);
      return;
    }

    req.user.wardname = zone[0].wardname;
    req.user.zonename = zone[0].zonename;
    req.user.sachivalyamname = zone[0].sachivalyamname;

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
      return;
    } else {
      send.response(res, "success", Tasks, 200);
      return;
    }
  } catch (err) {
    send.response(res, err, [], 500);
    return;
  }
};

exports.getAllTaskData = async (req, res) => {
  try {
    var Tasks = [];
    Tasks = await TaskService.getTaskData(req.body);

    send.response(res, "success", Tasks, 200);
  } catch (err) {
    console.log("Error: ", err);
    return send.response(res, err, [], 500);
  }
};

exports.getBarGraphData = async (req, res) => {
  try {
    var Tasks = [];
    Tasks = await TaskService.getBarGraphDataList(req.body);
    let data = [];

    for (const iterator of Tasks) {
      var mapData = {};
      mapData["date"] = iterator._id;
      let actualCount = [];
      let barGraphCount = [];
      index = iterator.status.indexOf("Completed");
      if (index != -1) {
        actualCount.push(iterator.statusCount[index], iterator.totalTask);
        barGraphCount.push(
          iterator.statusCount[index],
          iterator.totalTask + iterator.statusCount[index]
        );
      } else {
        actualCount.push(0, iterator.totalTask);
        barGraphCount.push(0, iterator.totalTask);
      }
      mapData["actualCount"] = actualCount;
      mapData["barGraphCount"] = barGraphCount;
      data.push(mapData);
    }

    send.response(res, "success", data, 200);
  } catch (err) {
    console.log("Error: ", err);
    return send.response(res, err, [], 500);
  }
};

exports.getPieGraphData = async (req, res) => {
  try {
    var total = 0;
    var completed = 0;
    var completedPercent = 0;
    var Tasks = [];
    Tasks = await TaskService.getPieGraphDataList(req.body);
    for (const iterator of Tasks) {
      total = total + iterator.count;
      if (iterator._id == "Completed") {
        completed = iterator.count;
      }
    }
    if (total != 0) {
      completedPercent = (completed / total) * 100;
    }

    var mapData = {
      total: total,
      completed: completed,
      completedPercent: completedPercent,
    };

    send.response(res, "success", mapData, 200);
  } catch (err) {
    console.log("Error: ", err);
    return send.response(res, err, [], 500);
  }
};

exports.getAllTaskStatusForPortal = async (req, res) => {
  try {
    var completedTaskCount = 0;
    var ongoingTaskCount = 0;
    var inReviewTaskCount = 0;
    var totalAssignedTask = 0;

    var Tasks = [];
    Tasks = await TaskService.getAllTaskStatusCount();

    for (const iterator of Tasks) {
      if (iterator._id == "Completed") {
        completedTaskCount = iterator.Count;
        totalAssignedTask = totalAssignedTask + iterator.Count;
      } else if (iterator._id == "Ongoing") {
        ongoingTaskCount = iterator.Count;
        totalAssignedTask = totalAssignedTask + iterator.Count;
      } else if (iterator._id == "In-review") {
        inReviewTaskCount = iterator.Count;
        totalAssignedTask = totalAssignedTask + iterator.Count;
      }
    }
    var mapData = {
      totalAssignedTask: totalAssignedTask,
      inReview: inReviewTaskCount,
      ongoing: ongoingTaskCount,
      completed: completedTaskCount,
    };

    send.response(res, "success", mapData, 200);
  } catch (err) {
    console.log("Error: ", err);
    return send.response(res, err, [], 500);
  }
};

exports.getTodaysTasks = async (req, res) => {
  if (req.params.id == null) {
    send.response(res, "User Id Not Found", {}, 404);
    return;
  }
  try {
    let zone = await zoneExtract.extractWardZoneSachivalayamName(req, res);

    if (zone == undefined || zone.length <= 0) {
      send.response(res, "Zone Not found", [], 404);
      return;
    }

    req.user.wardname = zone[0].wardname;
    req.user.zonename = zone[0].zonename;
    req.user.sachivalyamname = zone[0].sachivalyamname;

    const Tasks = await TaskService.getTodaysTasks(
      req.params.id,
      req.role,
      req.user
    );
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
        `${config.baseURL}/${folderConfig.TASK_IMAGE_KEY}/${iterator}`
      );
    }
  } else if (typeof req.body.before_image == "string") {
    imageLink.push(
      `${config.baseURL}/${folderConfig.TASK_IMAGE_KEY}/${req.body.before_image}`
    );
  } else {
    send.response(res, "Before Image format not supported", {}, 401);
  }

  req.body.before_image = imageLink;

  let zone = await zoneExtract.extractWardZoneSachivalayamName(req, res);

  if (zone.length <= 0) {
    send.response(res, "Zone Not found", [], 404);
    return;
  }

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
  if (req.role === "sanitaryInspector") {
    try {
      const Task = await TaskService.updateTask(req.params.id, req.body);
      send.response(res, "success", Task, 200);
    } catch (err) {
      send.response(res, err, [], 500);
    }
  } else if (req.role === "secretary") {
    console.log("received update task request", req.body);
    if (req.body.after_image == null || req.body.after_image.length == 0) {
      send.response(res, "Please send after images also", {}, 404);
      return;
    }
    var imageLink = [];
    if (typeof req.body.after_image == "object") {
      for (const iterator of req.body.after_image) {
        imageLink.push(
          `${config.baseURL}/${folderConfig.TASK_IMAGE_KEY}/${iterator}`
        );
      }
    } else if (typeof req.body.after_image == "string") {
      imageLink.push(
        `${config.baseURL}/${folderConfig.TASK_IMAGE_KEY}/${req.body.after_image}`
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
};

exports.deleteTask = async (req, res) => {
  try {
    const Task = await TaskService.deleteTask(req.params.id);
    send.response(res, "success", Task, 200);
  } catch (err) {
    send.response(res, err, [], 500);
  }
};
