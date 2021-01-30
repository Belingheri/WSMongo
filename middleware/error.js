const logger = require("../utlility/logger");

module.exports = function (err, req, res, next) {
  logger.error(err.message, err);

  // error
  // warn
  // info
  // verbose
  // debug
  // sillyπ
  if ((process.env.NODE_ENV = "production"))
    return res.status(500).send("Errore interno");
  else return res.status(500).send(err.message);
};
