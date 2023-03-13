const UserService = require("../services/userServices");
const ZoneService = require("../services/zoneServices");
const send = require("../services/responseServices.js");
const UserModel = require("../models/user.model");

exports.getAllUsers = async (req, res) => {
  try {
    const Users = await UserService.getAllUsers();
    send.response(res, "success", Users, 200);
  } catch (err) {
    send.response(res, err, [], 500);
  }
};

exports.getAllSecretory = async (req, res) => {
  try {
    const Users = await UserService.getAllSecretary();
    const UsersCount = await UserService.getAllSecretaryCount();
    // console.log(UsersCount);
    send.response(res, "success", { secretory: Users, count: UsersCount }, 200);
  } catch (err) {
    console.log(err);
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

exports.getAllWorkersAttendance = async (req, res) => {
  try {
    var total = 0;
    var present = 0;
    var presentPercentage = 0;
    var absent = 0;
    var absentPercentage = 0;
    const Users = await UserService.getAllWorkerAttendanceInfo(req.body);
    for (const iterator of Users) {
      total = total + 1;
      if (iterator.present == true) {
        present = present + 1;
      } else if (iterator.present == false) {
        absent = absent + 1;
      }
    }
    if (total > 0) {
      presentPercentage = (present / total) * 100;
      absentPercentage = (absent / total) * 100;
    }
    var map = {
      total: total,
      present: present,
      presentPercentage: presentPercentage,
      absent: absent,
      absentPercentage: absentPercentage,
    };
    send.response(res, "success", map, 200);
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

exports.uploadBulkSecretoryExcel = async (req, res) => {
  if (req.filename == null || req.filename == undefined) {
    send.response(res, "File name not found", [], 404);
    return;
  }
  try {
    let data = await UserService.excelToJson(`./EXCEL/${req.filename}`);
    // console.log(data);
    var totalCount = 0;
    var addedCount = 0;
    var failedCount = 0;
    if (data != undefined && data.length > 0) {
      let secretaryRole = await RoleModel.findOne({ name: "secretary" });
      for (let i = 0; i < data.length; i++) {
        let emailCheck = await UserService.usersEmailCheck(null, data[i].email);
        let zoneCheck = await ZoneService.getZoneDataIds(data[i]);
        totalCount = totalCount + 1;
        if (emailCheck == null && secretaryRole != null) {
          if (zoneCheck.length > 0) {
            data[i].zone = zoneCheck[0]._id;
            data[i].ward = zoneCheck[0].wardid;
            data[i].sachivalyam = zoneCheck[0].sachivalyamid;
            data[i].roles = secretaryRole._id;
          }
          data[i]["workingSlots"] = data[i]["workingSlots"].split(",");
          // console.log(data[i]);
          // console.log(zoneCheck,emailCheck);
          await UserModel.create(data[i])
            .then(() => {
              addedCount = addedCount + 1;
            })
            .catch((err) => {
              console.log("Error while bulk upload of secretory: ", err);
              failedCount = failedCount + 1;
            });
        } else {
          failedCount = failedCount + 1;
        }
      }
    }
    send.response(
      res,
      "success",
      {
        totalCount: totalCount,
        addedCount: addedCount,
        failedCount: failedCount,
      },
      200
    );
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
    let emailCheck = await UserService.usersEmailCheck(
      req.params.id,
      req.body.email
    );
    if (emailCheck != undefined || emailCheck != null) {
      send.response(res, `Email: ${req.body.email} is already in use`, {}, 404);
      return;
    }
    let zoneCheck = await ZoneService.getZoneDataIds(req.body);
    if (zoneCheck.length > 0) {
      if (zoneCheck[0]._id != undefined && zoneCheck[0]._id != null) {
        req.body.zone = zoneCheck[0]._id;
      }
      if (zoneCheck[0].wardid != undefined && zoneCheck[0].wardid != null) {
        req.body.ward = zoneCheck[0].wardid;
      }
      if (
        zoneCheck[0].sachivalyamid != undefined &&
        zoneCheck[0].sachivalyamid != null
      ) {
        req.body.sachivalyam = zoneCheck[0].sachivalyamid;
      }
    }
    // console.log(req.body);
    const User = await UserService.updateUser(req.params.id, req.body);
    send.response(res, "success", User, 200);
  } catch (err) {
    console.log(err);
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
