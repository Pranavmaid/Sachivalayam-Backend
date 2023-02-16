const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const folderConfig = require("./app/config/folder.config");
const fs = require("fs");

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

db.mongoose
  .connect(dbConfig.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
    generateFolders();
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
