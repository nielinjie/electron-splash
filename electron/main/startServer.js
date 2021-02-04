const path = require("path");
const logger = require("../logger");
const server = require("../../splash/server").server;

function startServer() {

  logger.info(`Launching main server ...`);
  const pa = path.resolve(__dirname, "../../main/server");
  let serverProcess = require("child_process").spawn("npm", ["start"], {
    cwd: pa,
  });

  serverProcess.stdout.on("data", (chunk) => {
    logger.server(chunk.toString());
    server.fire(chunk.toString());
  });
  serverProcess.stderr.on("data", (chunk) => {
    logger.server(chunk.toString());
    server.fire(chunk.toString());
  });

  if (serverProcess.pid) {
    logger.info("Main Server PID: " + serverProcess.pid);
  } else {
    logger.error("Failed to launch main server process.");
  }
  return serverProcess;
}
exports.startServer = startServer;
