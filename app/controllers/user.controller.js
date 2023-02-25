const UserService = require("../services/userServices");
const send = require("../services/responseServices.js");
const RoleModel = require("../models/role.model");

exports.getAllUsers = async (req, res) => {
  try {
    const Users = await UserService.getAllUsers();
    send.response(res, "success", Users, 200);
  } catch (err) {
    send.response(res, err, [], 500);
  }
};

exports.getAllWorkers = async (req, res) => {
  try {
    const Users = await UserService.getAllWorkersOfSupervisor(req.userId);
    send.response(res, "success", Users, 200);
  } catch (err) {
    console.log(err);
    send.response(res, err, [], 500);
  }
};

exports.uploadBulkExcel = async (req, res) => {
  if (req.body.filename == null || req.body.filename == undefined) {
    send.response(res, "File name not found", [], 404);
    return;
  }
  try {
    let data = await UserService.excelToJson(`./EXCEL/${req.body.filename}`);
    if (data != undefined && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        data[i]["ward"] = req.user.ward;
        data[i]["zone"] = req.user.zone;
        data[i]["sachivalyam"] = req.user.sachivalyam;
        data[i]["workingSlots"] = data[i]["workingSlots"].split(",");
      }
    }
    const Users = await UserService.insertManyUser(data);
    send.response(res, "success", Users, 200);
  } catch (err) {
    console.log(err);
    if (err.code === "ENOENT") {
      send.response(
        res,
        `File With Name ${req.body.filename} Not Found, Please send correct filename`,
        [],
        404
      );
    } else {
      send.response(res, err, [], 500);
    }
  }
};

exports.createUser = async (req, res) => {
  try {
    const User = await UserService.createUser(req.body);
    send.response(res, "success", User, 200);
  } catch (err) {
    send.response(res, err, [], 500);
  }
};

exports.getUserById = async (req, res) => {
  try {
    var User = await UserService.getUserById(req.params.id);
    if (User.length == 0) {
      send.response(res, "No user found with provided id", [], 500);
      return;
    }
    send.response(res, "success", User[0], 200);
  } catch (err) {
    console.log(err);
    send.response(res, err, [], 500);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const User = await UserService.updateUser(req.params.id, req.body);
    send.response(res, "success", User, 200);
  } catch (err) {
    send.response(res, err, [], 500);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const User = await UserService.deleteUser(req.params.id);
    send.response(res, "success", User, 200);
  } catch (err) {
    send.response(res, err, [], 500);
  }
};
