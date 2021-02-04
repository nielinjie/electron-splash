const electron = require("electron");
const path = require("path");
const logger = require("./logger");
const { startServer } = require("./main/startServer");
const { killServer } = require("./main/killServer");
const startSplashServer = require("./splash/startServer").startServer;
const killSplashServer = require("./splash/killServer").killServer;
const axios = require("axios");

const { app, BrowserWindow, dialog } = electron;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// The server process
let serverProcess;
let splashServer;
function createWindow() {
  setTimeout(
    () =>
      cycle(
        "http://localhost:4999/health",
        10,
        () => {
          mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
              preload: path.join(__dirname, "preload.js"),
              nodeIntegration: false,
            },
          });
          mainWindow.loadURL("http://localhost:4999");
          mainWindow.on("closed", function () {
            mainWindow = null;
          });
        },
        () => {
          logger.info("time out when start splash server");
        },
        (e) => {
          logger.info("error when start splash server");
          logger.error(e);
        }
      ),
    0
  );
}

function cycle(
  health,
  maxCheck,
  onSuccess,
  onTimeout,
  onFailure,
  checkCount = 0
) {
  axios
    .get(health)
    .then((response) => {
      onSuccess();
    })
    .catch((e) => {
      if (e.code === "ECONNREFUSED") {
        if (checkCount < maxCheck) {
          setTimeout(
            () =>
              cycle(
                health,
                maxCheck,
                onSuccess,
                onTimeout,
                onFailure,
                checkCount + 1
              ),
            500
          );
        } else {
          onTimeout();
        }
      } else {
        logger.error(e);
        onFailure(e);
      }
    });
}

function loadHomePage(baseUrl, health, callback) {
  logger.info(`Loading home page at ${baseUrl}`);
  setTimeout(
    () =>
      cycle(
        health,
        20,
        () => {
          callback();
          mainWindow.loadURL(baseUrl);
        },
        () => {
          dialog.showErrorBox(
            "Server timeout",
            `UI does not receive server response for 10 seconds.`
          );
          app.quit();
        },
        (e) => {
          dialog.showErrorBox(
            "Server error",
            "UI receives an error from server."
          );
          app.quit();
        }
      ),
    0
  );
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", function () {
  logger.info("###################################################");
  logger.info("#                Application Start                #");
  logger.info("###################################################");
  logger.info(`Starting Splash server`);
  splashServer = startSplashServer();
  logger.info(`Creating main window`);
  createWindow();
  logger.info(`Starting mains server`);
  serverProcess = startServer();
  loadHomePage(`http://localhost:5000`, "http://localhost:5000", () => {
    killSplashServer(splashServer);
  });
});

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("will-quit", () => {
  logger.log("will quit");
  killServer(serverProcess, app);
});
