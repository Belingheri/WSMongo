require("dotenv").config();
const express = require("express");
const logger = require("./utlility/logger");
const error = require("./middleware/error");
const app = express();
const port = process.env.PORT || 3000;

require("./startup/routes")(app);

app.listen(port, () => {
  logger.info(`Listening at port:${port}`);
});
