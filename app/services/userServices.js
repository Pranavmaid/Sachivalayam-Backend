const UserModel = require("../models/user.model");
const RoleModel = require("../models/role.model");
const { ObjectId } = require("mongodb");

exports.getAllUsers = async () => {
  return await UserModel.find();
};

exports.getAllWorkers = async () => {
  let workerRole = await RoleModel.findOne({ name: "worker" });
  return await UserModel.find({ roles: workerRole._id });
};

exports.createUser = async (user) => {
  return await UserModel.create(user);
};
exports.getUserById = async (id) => {
  return await UserModel.findById(id);
};

exports.updateUser = async (id, user) => {
  return await UserModel.findByIdAndUpdate(id, user);
};

exports.deleteUser = async (id) => {
  return await UserModel.findByIdAndDelete(id);
};

exports.getAllWorkersOfSupervisor = async (id) => {
  console.log(id);
  let workerRole = await RoleModel.findOne({ name: "worker" });
  return await UserModel.find({
    roles: workerRole._id,
    supervisor: ObjectId(id),
  });
};
