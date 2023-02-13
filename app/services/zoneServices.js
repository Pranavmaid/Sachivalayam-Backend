const ZoneModel = require("../models/zone.model");
 
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