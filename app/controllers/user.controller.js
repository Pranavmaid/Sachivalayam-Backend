exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.secretaryBoard = (req, res) => {
    res.status(200).send("secretary Content.");
  };
  
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  
  exports.workerBoard = (req, res) => {
    res.status(200).send("Worker Content.");
  };