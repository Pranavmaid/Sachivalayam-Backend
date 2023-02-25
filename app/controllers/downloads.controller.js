const DownloadService = require("../services/downloadsServices");
const send = require("../services/responseServices.js");

exports.createDownloadsFile = async (req, res) => {
  try {
    const Data = await DownloadService.createDownloadsFile(req.body);
    send.response(res, "success", Data, 200);
  } catch (err) {
    send.response(res, err, [], 500);
  }
};

exports.getDownloadById = async (req, res) => {
  if (req.body.filename == null || req.body.filename == undefined) {
    send.response(res, "File Name Not Provided", data, 404);
    return;
  }
  try {
    var data = await DownloadService.findDownloadsFile(req.body.filename);
    if (data == null) {
      send.response(res, "Download file not found", [], 404);
      return;
    }
    send.response(res, "success", data, 200);
  } catch (err) {
    console.log(err);
    send.response(res, err, [], 500);
  }
};

exports.updateDownloadFile = async (req, res) => {
  try {
    const Download = await DownloadService.updateDownloadsFile(
      req.params.id,
      req.body
    );
    send.response(res, "success", Download, 200);
  } catch (err) {
    send.response(res, err, [], 500);
  }
};

exports.deleteDownload = async (req, res) => {
  try {
    const Download = await DownloadService.deleteDownloadsFile(req.params.id);
    send.response(res, "success", Download, 200);
  } catch (err) {
    send.response(res, err, [], 500);
  }
};
