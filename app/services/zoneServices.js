const ZoneModel = require("../models/zone.model");
const UserModel = require("../models/user.model");
const { ObjectId } = require("mongodb");

exports.getAllZones = async () => {
  return await ZoneModel.find();
};

exports.createZone = async (zone) => {
  return await ZoneModel.create(zone);
};
exports.getZoneById = async (id) => {
  return await ZoneModel.findById(id);
};

exports.updateZone = async (id, zone) => {
  return await ZoneModel.findByIdAndUpdate(id, zone);
};

exports.deleteZone = async (id) => {
  return await ZoneModel.findByIdAndDelete(id);
};

exports.getAssignedWorkAreas = async (id) => {
  let user = await UserModel.findOne({ _id: ObjectId(id) });
  return await ZoneModel.aggregate([
    {
      $match: {
        _id: ObjectId(user.zone),
      },
    },
    {
      $unwind: {
        path: "$ward",
      },
    },
    {
      $match: {
        "ward._id": ObjectId(user.ward),
      },
    },
    {
      $unwind: {
        path: "$ward.sachivalyam",
      },
    },
    {
      $match: {
        "ward.sachivalyam._id": ObjectId(user.sachivalyam),
      },
    },
    {
      $project: {
        workArea: "$ward.sachivalyam.areas",
      },
    },
  ]);
};

exports.getZoneDataList = async () => {
  return await ZoneModel.aggregate([
    {
      $unwind: {
        path: "$ward",
      },
    },
    {
      $unwind: {
        path: "$ward.sachivalyam",
      },
    },
    {
      $group: {
        _id: "$__v",
        zone: {
          $addToSet: "$name",
        },
        ward: {
          $addToSet: "$ward.name",
        },
        sachivalyam: {
          $addToSet: "$ward.sachivalyam.name",
        },
      },
    },
  ]);
};
