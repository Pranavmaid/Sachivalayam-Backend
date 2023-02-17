const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
const send = require("../services/responseServices.js");

checkDuplicateEmail = (req, res, next) => {
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
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        send.response(
          res,
          `Failed! Role ${req.body.roles[i]} does not exist!`,
          [],
          400
        );
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateEmail,
  checkRolesExisted,
};

module.exports = verifySignUp;
