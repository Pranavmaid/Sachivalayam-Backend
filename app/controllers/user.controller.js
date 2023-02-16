const UserService = require("../services/userServices");
const send = require("../services/responseServices.js");

exports.getAllUsers = async (req, res) => {
  try {
    const Users = await UserService.getAllUsers();
    send.response(res, "success", Users, 200);
  } catch (err) {
    send.response(res, err, [], 500);
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
    const User = await UserService.getUserById(req.params.id);
    send.response(res, "success", User, 200);
  } catch (err) {
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
