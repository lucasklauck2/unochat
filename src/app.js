const { app, BrowserWindow, ipcMain, desktopCapturer } = require("electron");
const electron = require("electron");
const url = require("url");
const path = require("path");

let mainWindow;

function createWindow() {
  var screenElectron = electron.screen;
  var mainScreen = screenElectron.getPrimaryDisplay();
  var dimensoes = mainScreen.workArea;

  mainWindow = new BrowserWindow({
    width: dimensoes.width,
    height: dimensoes.height,
    frame: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "/preload.js"),
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `../dist/index.html`),
      protocol: "file:",
      slashes: true,
    })
  );

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});

ipcMain.handle("compartilhar_tela", async (event, arg) => {
  console.log("RECEBIDO COMPARTILHAMENTO");

  return new Promise((resolve) => {
    desktopCapturer
      .getSources({ types: ["window", "screen"] })
      .then(async (sources) => {
        resolve(sources[0].id);
      });
  });
});

ipcMain.handle("fechar_aplicacao", async (event, arg) => {
  app.quit();

  return true;
});
