const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');

contextBridge.exposeInMainWorld('electronAPI', {
  readImage: (imagePath) => {
    const file = fs.readFileSync(imagePath);
    return `data:image/jpeg;base64,${file.toString('base64')}`;
  },
});
