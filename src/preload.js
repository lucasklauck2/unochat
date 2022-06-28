
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('iniciarCompartilhamentoTela', function () {
  return new Promise((resolve) => {
    ipcRenderer.invoke('compartilhar_tela').then((sourceId) => {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: sourceId,
              minWidth: 1280,
              maxWidth: 1280,
              minHeight: 720,
              maxHeight: 720,
            },
          },
        })
        .then((stream) => {
          const video = document.createElement("video");
          video.srcObject = stream;
          resolve(video);
        });
    });
  });
});

contextBridge.exposeInMainWorld('fecharAplicacao', function () {
  return new Promise((resolve) => {
    ipcRenderer.invoke('fechar_aplicacao').then((arg) => {
      resolve(true);
    });
  });
});
