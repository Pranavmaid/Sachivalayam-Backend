const db = require("../models");
const Zone = db.user;
const send = require("../services/responseServices.js");

extractWardZoneSachivalayamName = async(req, res) => {
    console.log("User is ", req.user);

    return await Zone.aggregate([{
        $match: {
        _id: req.user.zone,
        },
    },
    {
        $unwind: {
        path: "$ward",
        },
    },
    {
        $match: {
        "ward._id": req.user.ward,
        },
    },
    {
        $unwind: {
        path: "$ward.sachivalyam",
        },
    },
    {
        $match: {
        "ward.sachivalyam._id": req.user.sachivalyam,
        },
    },
    {
        $project: {
        zonename: "$name",
        wardname: "$ward.name",
        sachivalyamname: "$ward.sachivalyam.name",
        },
    },
    ]);
  };