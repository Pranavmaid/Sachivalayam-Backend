const Downloads = require("../models/downloads.model");

exports.createDownloadsFile = async (data) => {
  return await Downloads.create(data);
};

exports.updateDownloadsFile = async (id, data) => {
  return await Downloads.findByIdAndUpdate(id, data);
};

exports.findDownloadsFile = async (filename) => {
  return await Downloads.findOne({ name: filename });
};

exports.deleteDownloadsFile = async (id) => {
  return await Downloads.findByIdAndDelete(id);
};
