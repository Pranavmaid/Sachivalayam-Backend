const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

const send = require("../services/responseServices.js");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    phone: req.body.phone,
    ward: req.body.ward,
    zone: req.body.zone,
    sachivalyam: req.body.sachivalyam,
    gender: req.body.gender,
    age: req.body.age,
  });

  user.save((err, user) => {
    if (err) {
      send.response(res, err, [], 500);
      return;
    }
    if (req.body.roles) {
      console.log(req.body.roles);
      Role.findOne(
        {
          name: req.body.roles,
        },
        (err, roles) => {
          console.log(roles);
          if (err) {
            send.response(res, err, [], 500);
            return;
          }
          user.roles = roles._id;
          user.save((err, updatedUser) => {
            if (err) {
              send.response(res, err, [], 500);
              return;
            }
            send.response(res, "success", updatedUser, 200);
          });
        }
      );
    } else {
      Role.findOne({ name: "worker" }, (err, role) => {
        if (err) {
          send.response(res, err, [], 500);
          return;
        }

        user.roles = [role._id];
        user.save((err, worker) => {
          if (err) {
            send.response(res, err, [], 500);
            return;
          }

          send.response(res, "success", worker, 200);
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.email,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        send.response(res, err, [], 500);
        return;
      }

      if (!user) {
        send.response(res, "User Not found.", [], 404);
        return;
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        send.response(res, "Invalid Password!", [], 401);
        return;
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 604800, // 7 days
      });

      var authorities = "";

      authorities = "ROLE_" + user.roles.name.toUpperCase();
      send.response(
        res,
        "success",
        {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          ward: user.ward,
          zone: user.zone,
          sachivalyam: user.sachivalyam,
          gender: user.gender,
          age: user.age,
          roles: authorities,
          accessToken: token,
        },
        200
      );
    });
};
