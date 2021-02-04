const logger = require("../logger");
const server= require("../../splash/server").server

function startServer() {
  server.listen(4999, () => logger.info(`Listening on port 4999`));
  return server
}
exports.startServer = startServer;
