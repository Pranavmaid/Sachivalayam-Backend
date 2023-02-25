const multer = require("multer");
const folderConfig = require("../config/folder.config");
const send = require("../services/responseServices.js");

exports.excelUpload = async (req, res, next) => {
  const excelStorage = multer.diskStorage({
    // Destination to store image
    destination: `${folderConfig.EXCEL_FOLDER}`,
    filename: (req, file, cb) => {
      cb(null, file.originalname);
      // file.originalname is name of the field (image)
    },
  });

  const upload = multer({
    storage: excelStorage,
    fileFilter(req, file, cb) {
      if (
        !file.originalname.match(
          /\.(.xls|xlsx|xlsb|xltx|xltm|xls|xlt|xml|csv)$/
        )
      ) {
        // upload only png and jpg format
        return cb(
          new multer.MulterError("Please upload excel with right excel format")
        );
      }
      cb(undefined, true);
    },
  }).array(`${folderConfig.WORKER_EXCEL_KEY}`, folderConfig.WORKER_MAX_EXCEL);

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      send.response(res, err.code, {}, 406);
      return;
    }
    // Everything went fine.
    next();
  });
};

exports.imageUpload = async (req, res, next) => {
  const imageStorage = multer.diskStorage({
    // Destination to store image
    destination: `${folderConfig.TASK_FOLDER}`,
    filename: (req, file, cb) => {
      cb(null, file.originalname);
      // file.originalname is name of the field (image)
    },
  });

  const upload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(png|PNG|jpg|JPG|JPEG|jpeg)$/)) {
        // upload only png and jpg format
        return cb(
          new multer.MulterError("Please upload a image with right format")
        );
      }
      cb(undefined, true);
    },
  }).array(`${folderConfig.TASK_IMAGE_KEY}`, folderConfig.TASK_MAX_IMAGES);

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.

      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        send.response(res, `Wrong image key ${err.field}`, {}, 404);
        return;
      } else {
        send.response(res, err.code, {}, 406);
        return;
      }
    }
    // Everything went fine.
    next();
  });
};
