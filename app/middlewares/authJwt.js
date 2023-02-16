const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;
const send = require("../services/responseServices.js");

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    send.response(res, "No token provided!", [], 403);
    return;
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      send.response(res, "Unauthorized!", [], 401);
      return;
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      send.response(res, err, [], 500);
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          send.response(res, err, [], 500);
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        send.response(res, "Require Admin Role!", [], 403);
        return;
      }
    );
  });
};

isSecretary = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      send.response(res, err, [], 500);
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          send.response(res, err, [], 500);
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "secretary") {
            next();
            return;
          }
        }

        send.response(res, "Require secretary Role!", [], 403);
        return;
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isSecretary,
};
module.exports = authJwt;
