const express = require("express");
const router = express.Router();
const dbLog = require("../utlility/dbLog");

router.post("/:database/:collection", async (req, res, next) => {
  try {
    if (!req.params.database || !req.params.collection)
      return res.status(400).send("database e collection obbligatori");
    if (!req.body) return res.status(400).send("body vuoto");
    const databaseName = req.params.database;
    const collectionName = req.params.collection;
    const obj = req.body;
    if (Array.isArray(obj)) {
      obj.forEach(async (el) => {
        await dbLog.salvaDato(el, collectionName, databaseName);
      });
    } else {
      await dbLog.salvaDato(obj, collectionName, databaseName);
    }
    return res.json({ status: "ok" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
