const { app, BrowserWindow } = require('electron');
const path = require('path');
const ElectronStore = require('electron-store').default;  // Sửa chỗ này
const store = new ElectronStore();

console.log('Electron Store path:', store.path);


function createWindow() {
  console.log('App name:', app.getName());

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Dev
  win.loadURL('http://localhost:3000');

  // Production
  // win.loadFile('out/index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
