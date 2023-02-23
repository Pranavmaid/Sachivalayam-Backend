const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
const send = require("../services/responseServices.js");

checkDuplicateEmail = (req, res, next) => {
  if (req.body.roles != "worker") {
    // Email
    User.findOne({
      email: req.body.email,
    }).exec((err, user) => {
      if (err) {
        send.response(res, err, [], 500);
        return;
      }

      if (user) {
        send.response(res, "Failed! Email is already in use!", [], 400);
        return;
      }

      next();
    });
  } else {
    next();
  }
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    if (!ROLES.includes(req.body.roles)) {
      send.response(
        res,
        `Failed! Role ${req.body.roles} does not exist!`,
        [],
        400
      );
      return;
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateEmail,
  checkRolesExisted,
};

module.exports = verifySignUp;
