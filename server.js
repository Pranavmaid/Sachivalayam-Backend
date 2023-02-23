const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const folderConfig = require("./app/config/folder.config");
const fs = require("fs");
const XLSX = require("xlsx");

const app = express();

var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;
const TaskDetails = db.taskDetails;
const Zones = db.zone;

db.mongoose
  .connect(dbConfig.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
    createBasicTask();
    generateFolders();
    createZone();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "secretary",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'secretary' to roles collection");
      });

      new Role({
        name: "worker",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'worker' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });

      new Role({
        name: "sanitaryInspector",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'sanitary inspector' to roles collection");
      });
    }
  });
}

function createBasicTask() {
  TaskDetails.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new TaskDetails({
        task_name: "Drain Cleaning",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Drain Cleaning' to task details collection");
      });

      new TaskDetails({
        task_name: "Sweeping",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Sweeping' to task details collection");
      });

      new TaskDetails({
        task_name: "Litter Cleaning",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Litter Cleaning' to task details collection");
      });

      new TaskDetails({
        task_name: "Door to Door garbage Collection",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log(
          "added 'Door to Door garbage Collection' to task details collection"
        );
      });
    }
  });
}

function createZone() {
  Zones.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Zones({
        name: "1",
        ward: [
          {
            name: "1",
            sachivalyam: [
              {
                name: "CHITTIVALASA",
                sachivalyam_no: "21089001",
                areas: [
                  {
                    name: "VEMAPDA VEEDHI",
                  },
                  {
                    name: "PRIMARY SCHOOL",
                  },
                  {
                    name: "AMBEDAKR STATUE",
                  },
                  {
                    name: "ANNA CANTEEN",
                  },
                  {
                    name: "OPP RAMULAMMA THEATER",
                  },
                  {
                    name: "BOYS HOSTEL",
                  },
                  {
                    name: "NEW COLONY",
                  },
                  {
                    name: "HIGH SCHOOL",
                  },
                  {
                    name: "PUMPHOUSE ROAD",
                  },
                  {
                    name: "KONDAPETA COLONY",
                  },
                ],
              },
            ],
          },
          {
            name: "2",
            sachivalyam: [
              {
                name: "ADARSANAGAR 1",
                sachivalyam_no: "21089013",
                areas: [
                  {
                    name: "SHED LINE",
                  },
                  {
                    name: "NTR PARK",
                  },
                  {
                    name: "SABBIVANIPETA",
                  },
                  {
                    name: "ANDHRA BANK",
                  },
                  {
                    name: "KUMMARI VEEDHI",
                  },
                  {
                    name: "MEE SEVA AREA",
                  },
                ],
              },
            ],
          },
        ],
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added '1' to zone collection");
      });

      new Zones({
        name: "2",
        ward: [
          {
            name: "5",
            sachivalyam: [
              {
                name: "Ayodhya Nagar",
                sachivalyam_no: "1086072",
                areas: [
                  {
                    name: "ysr nagar type 2 block-14",
                  },
                  {
                    name: "ysr nagar type 2 block29",
                  },
                  {
                    name: "ysr nagar type 2 block-28",
                  },
                  {
                    name: "ysr nagar type 2 block-38",
                  },
                ],
              },
            ],
          },
        ],
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added '1' to zone collection");
      });
    }
  });
}

function generateFolders() {
  try {
    if (!fs.existsSync(`./${folderConfig.TASK_FOLDER}`)) {
      fs.mkdirSync(`./${folderConfig.TASK_FOLDER}`);

      console.log(`${folderConfig.TASK_FOLDER} Folder Created Successfully.`);
    }
  } catch (error) {
    console.log(
      `Oops! something went wrong while creating ${folderConfig.TASK_FOLDER} folder. Error:`,
      error
    );
  }
  try {
    if (!fs.existsSync(`./${folderConfig.EXCEL_FOLDER}`)) {
      fs.mkdirSync(`./${folderConfig.EXCEL_FOLDER}`);

      console.log(`${folderConfig.EXCEL_FOLDER} Folder Created Successfully.`);
    }
  } catch (error) {
    console.log(error);
  }
}

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/task.routes")(app);
require("./app/routes/zone.routes")(app);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Sachivalyam Repoting System." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
app.use("/task_images", express.static("TaskImages"));

// const excelToJson = async (filePath) => {
//   const wb = XLSX.readFile(filePath);
//   const ws = wb.Sheets["Sheet1"];
//   const data = XLSX.utils.sheet_to_json(ws);
//   var filteredData = [];
//   var zone = null;
//   var wardNo = null;
//   var sachivalyamName = null;
//   var ward = [];
//   var sachivalyam = [];
//   var area = [];
//   for (const iterator of data) {
//     if (iterator.Zone != undefined) {
//       if (iterator.Zone != zone) {
//         // filteredData.push({
//         //   name:zone,
//         //   ward: ward,
//         // })
//         zone = iterator.Zone;
//         ward.push(iterator.WardNo);
//         sachivalyam.push(iterator.Sachiwalayam);
//         area.push(iterator.Area);
//       } else {
//         if (iterator.WardNo != wardNo) {
//         } else {
//           sachivalyamName = iterator.Sachiwalayam;
//           area.push(iterator.Area);
//         }
//       }
//     } else {
//       area.push(iterator.Area);
//     }
//   }
//   console.log(data);
//   // console.log(data[0].LineNo);

//   return data;
// };

// excelToJson(`./EXCEL/GVMC.xlsx`);
