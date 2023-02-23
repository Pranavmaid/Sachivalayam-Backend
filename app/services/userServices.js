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
  var user = await UserModel.aggregate([
    {
      $match: {
        _id: new ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "roles",
        localField: "roles",
        foreignField: "_id",
        as: "result",
      },
    },
    {
      $unwind: {
        path: "$result",
      },
    },
    {
      $lookup: {
        from: "zones",
        let: {
          zoneCheck: "$zone",
          wardCheck: "$ward",
          sachivalyamCheck: "$sachivalyam",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$_id", "$$zoneCheck"],
                  },
                ],
              },
            },
          },
          {
            $unwind: {
              path: "$ward",
            },
          },
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$ward._id", "$$wardCheck"],
                  },
                ],
              },
            },
          },
          {
            $unwind: {
              path: "$ward.sachivalyam",
            },
          },
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$ward.sachivalyam._id", "$$sachivalyamCheck"],
                  },
                ],
              },
            },
          },
          {
            $project: {
              zonename: "$name",
              wardname: "$ward.name",
              sachivalyamname: "$ward.sachivalyam.name",
            },
          },
        ],
        as: "zoneResult",
      },
    },
    {
      $unwind: {
        path: "$zoneResult",
      },
    },
    {
      $project: {
        name: "$name",
        email: "$email",
        phone: "$phone",
        zone: "$zoneResult.zonename",
        ward: "$zoneResult.wardname",
        sachivalyam: "$zoneResult.sachivalyamname",
        roles: "$result.name",
        gender: "$gender",
        age: "$age",
        workingSlots: "$workingSlots",
        createdAt: "$createdAt",
        updatedAt: "$updatedAt",
      },
    },
  ]);
  return user;
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
