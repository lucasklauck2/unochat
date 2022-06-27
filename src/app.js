const { app, BrowserWindow, ipcMain } = require("electron");
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
    frame: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
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

ipcMain.on("sair", (event) => {
  console.log("Fechando aplicação");
  app.quit();
});

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});
