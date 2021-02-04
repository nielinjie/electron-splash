const logger = require("../logger");
function killServer(server) {
  server.close(()=>{
    logger.info('Splash server closed')
  })
}
exports.killServer = killServer;
