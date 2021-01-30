const express = require("express");
const general = require("../routes/general");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.get("/", (req, res) => {
    res.send("Service On");
  });
  app.use("/api", general);
  app.use(error);
};
