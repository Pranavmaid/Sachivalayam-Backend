const UserModel = require("../models/user.model");
const RoleModel = require("../models/role.model");
const { ObjectId } = require("mongodb");
const XLSX = require("xlsx");

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

exports.insertManyUser = async (data) => {
  return await UserModel.insertMany(data);
};

exports.getAllWorkerAttendanceInfo = async (filter) => {
  var start = new Date(filter.startDate);
  var end = new Date(filter.endDate);
  let query = [
    {
      $match: {
        createdAt: {
          $gte: new Date(start),
          $lte: new Date(end),
        },
        $expr: {
          $in: ["$$nameCheck", "$assigned_worker"],
        },
      },
    },
  ];
  if (filter.Zone != undefined && filter.Zone != null) {
    query.push({
      $match: {
        zone: {
          $in: filter.Zone,
        },
      },
    });
  }
  if (filter.Ward != undefined && filter.Ward != null) {
    query.push({
      $match: {
        ward: {
          $in: filter.Ward,
        },
      },
    });
  }
  if (filter.Swachlayam != undefined && filter.Swachlayam != null) {
    query.push({
      $match: {
        sachivalyam: {
          $in: filter.Swachlayam,
        },
      },
    });
  }
  let workerRole = await RoleModel.findOne({ name: "worker" });
  return await UserModel.aggregate([
    {
      $match: {
        roles: workerRole._id,
      },
    },
    {
      $lookup: {
        from: "tasks",
        let: {
          nameCheck: "$name",
        },
        pipeline: query,
        as: "result",
      },
    },
    {
      $project: {
        present: {
          $cond: [
            {
              $ifNull: [
                {
                  $arrayElemAt: ["$result", 0],
                },
                null,
              ],
            },
            true,
            false,
          ],
        },
      },
    },
  ]);
};

exports.excelToJson = async (filePath) => {
  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets["Sheet1"];
  const data = XLSX.utils.sheet_to_json(ws);
  // console.log(data);
  return data;
};

exports.getAllWorkersOfSupervisor = async (id) => {
  // console.log(id);
  let workerRole = await RoleModel.findOne({ name: "worker" });
  return await UserModel.find({
    roles: workerRole._id,
    supervisor: ObjectId(id),
  });
};

exports.getAllSecretary = async () => {
  // console.log(id);
  let role = await RoleModel.findOne({ name: "secretary" });
  return await UserModel.aggregate([
    {
      $match: {
        roles: role._id,
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
};

exports.getAllSecretaryCount = async () => {
  // console.log(id);
  let role = await RoleModel.findOne({ name: "secretary" });
  return await UserModel.countDocuments({
    roles: role._id,
  });
};
