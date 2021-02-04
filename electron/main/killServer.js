const logger = require("../logger");
function killServer(serverProcess) {
  if (serverProcess) {
    logger.info(`Killing main server process ${serverProcess.pid}`);
    const kill = require("tree-kill-sync");
    kill(serverProcess.pid, "SIGTERM");
    logger.info("Main Server process killed");
    serverProcess = null;
  }
}
exports.killServer = killServer;
