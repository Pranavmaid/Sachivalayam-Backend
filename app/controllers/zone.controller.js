const ZoneService = require("../services/zoneServices");
 
exports.getAllZones = async (req, res) => {
  try {
    const Zones = await ZoneService.getAllZones();
    res.json({ data: Zones, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
exports.createZone = async (req, res) => {
  try {
    const Zone = await ZoneService.createZone(req.body);
    res.json({ data: Zone, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
exports.getZoneById = async (req, res) => {
  try {
    const Zone = await ZoneService.getZoneById(req.params.id);
    res.json({ data: Zone, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
exports.updateZone = async (req, res) => {
  try {
    const Zone = await ZoneService.updateZone(req.params.id, req.body);
    res.json({ data: Zone, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
exports.deleteZone = async (req, res) => {
  try {
    const Zone = await ZoneService.deleteZone(req.params.id);
    res.json({ data: Zone, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};