const ZoneService = require("../services/zoneServices");
const send = require("../services/responseServices.js");

exports.getAllZones = async (req, res) => {
  try {
    const Zones = await ZoneService.getAllZones();
    send.response(res, "success", Zones, 200);
  } catch (err) {
    send.response(res, err, [], 500);
  }
};

exports.createZone = async (req, res) => {
  try {
    const Zone = await ZoneService.createZone(req.body);
    send.response(res, "success", Zone, 200);
  } catch (err) {
    send.response(res, err, [], 500);
  }
};

exports.getZoneById = async (req, res) => {
  try {
    const Zone = await ZoneService.getZoneById(req.params.id);
    send.response(res, "success", Zone, 200);
  } catch (err) {
    send.response(res, err, [], 500);
  }
};

exports.updateZone = async (req, res) => {
  try {
    const Zone = await ZoneService.updateZone(req.params.id, req.body);
    send.response(res, "success", Zone, 200);
  } catch (err) {
    send.response(res, err, [], 500);
  }
};

exports.deleteZone = async (req, res) => {
  try {
    const Zone = await ZoneService.deleteZone(req.params.id);
    send.response(res, "success", Zone, 200);
  } catch (err) {
    send.response(res, err, [], 500);
  }
};

exports.getZoneList = async (req, res) => {
  try {
    var Zones = [];
    Zones = await ZoneService.getZoneDataList();

    send.response(res, "success", Zones, 200);
  } catch (err) {
    console.log("Error: ", err);
    return send.response(res, err, [], 500);
  }
};
