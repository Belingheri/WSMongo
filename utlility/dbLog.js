const logger = require("./logger");

const MongoClient = require("mongodb").MongoClient;
const regexDate = /^([0-9]{4})-([0-1][0-9])-([0-3][0-9])T([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])Z$/gm;
if (!process.env.url_mongo) {
  logger.error("url_mongo non settato");
  process.exit(1);
}

let dbConnection;
/**
 * salva l'formazione su mongoDB
 * @param {objet} dato informazione da salvare nel db
 * @param {string} collectionName nome collection nella quale salvare l'informazione
 * @param {string} dataBaseName nome database  nella quale salvare l'informazione
 */
async function salvaDato(dato, collectionName, dataBaseName) {
  if (typeof dato !== "object") {
    logger.info(typeof dato);
    throw new TypeError("dato must be object");
  }
  if (typeof collectionName !== "string")
    throw new TypeError("collectionName must be string");
  if (typeof dataBaseName !== "string")
    throw new TypeError("dataBaseName must be string");

  //trsaformo le date in date
  Object.keys(dato).forEach((e) => {
    try {
      if (regexDate.test(dato[e])) {
        const dt = new Date(dato[e]);
        dato[e] = dt;
      }
    } catch (error) {
      // non è una data
    }
  });

  try {
    if (!dbConnection || !dbConnection.isConnected()) {
      await connettiti();
    }
    const result = await dbConnection
      .db(dataBaseName)
      .collection(collectionName)
      .insertOne(dato);

    if (result.insertedCount === 0) throw new Error("Nessun recod inserito");
    else logger.info("inserito");
  } catch (error) {
    throw error;
  }
}
/**
 * funzione che si connette al db di mongo
 */
async function connettiti() {
  try {
    logger.info(
      "Connessione al DB...",
      dbConnection && dbConnection.isConnected()
    );
    dbConnection = await MongoClient.connect(process.env.url_mongo, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Connesso al DB!");
  } catch (error) {
    throw error;
  }
}

/**
 * chiude la connesione al db di mongodb
 * @param {function} callback
 */
function closeConnection(callback) {
  logger.info("richiesta chiusura connessione...");
  if (dbConnection && dbConnection.isConnected()) {
    dbConnection.close(callback);
  }
}

module.exports = { salvaDato, closeConnection, connettiti };
