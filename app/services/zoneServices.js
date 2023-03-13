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

exports.getWorkAreas = async (filter) => {
  let query = [];
  // console.log(filter);
  if (filter.Zone != undefined && filter.Zone != null) {
    query.push({
      $match: {
        name: filter.Zone.toString(),
      },
    });
  }
  query.push(
    {
      $unwind: {
        path: "$ward",
      },
    },
    {
      $unwind: {
        path: "$ward.sachivalyam",
      },
    }
  );
  if (filter.Ward != undefined && filter.Ward != null) {
    query.push({
      $match: {
        "ward.name": filter.Ward.toString(),
      },
    });
  }
  if (filter.Sachivalyam != undefined && filter.Sachivalyam != null) {
    query.push({
      $match: {
        "ward.sachivalyam.name": filter.Sachivalyam.toString(),
      },
    });
  }
  query.push(
    {
      $unwind: {
        path: "$ward.sachivalyam.areas",
      },
    },
    {
      $group: {
        _id: "$__v",
        areas: {
          $push: "$ward.sachivalyam.areas.name",
        },
      },
    }
  );
  return await ZoneModel.aggregate(query);
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

exports.getZoneDataIds = async (filter) => {
  let query = [
    {
      $unwind: {
        path: "$ward",
      },
    },
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
  ];
  if (filter.zone != undefined && filter.zone != null) {
    query.push({
      $match: {
        name: filter.zone.toString(),
      },
    });
  }
  if (filter.ward != undefined && filter.ward != null) {
    query.push({
      $match: {
        "ward.name": filter.ward.toString(),
      },
    });
  }
  if (filter.sachivalyam != undefined && filter.sachivalyam != null) {
    query.push({
      $match: {
        "ward.sachivalyam.name": filter.sachivalyam.toString(),
      },
    });
  }
  query.push({
    $project: {
      wardid: "$ward._id",
      sachivalyamid: "$ward.sachivalyam._id",
    },
  });
  // console.log(query);
  // console.log(filter);
  return await ZoneModel.aggregate(query);
};
