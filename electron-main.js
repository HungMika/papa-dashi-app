const { app, BrowserWindow } = require('electron');
const path = require('path');
const ElectronStore = require('electron-store').default;
const axios = require('axios');

const store = new ElectronStore();
console.log('Electron Store path:', store.path);

async function waitForServer(url, retries = 40, interval = 500) {
  for (let i = 0; i < retries; i++) {
    try {
      await axios.get(url);
      return true;
    } catch (err) {
      console.log(`[Electron] Waiting for server... (${i + 1}/${retries})`);
      await new Promise((res) => setTimeout(res, interval));
    }
  }
  return false;
}

async function createWindow() {
  console.log('App name:', app.getName());

  const win = new BrowserWindow({
    show: false, // ẩn trước khi sẵn sàng
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.maximize();

  const devUrl = 'http://localhost:3000';

  const ready = await waitForServer(devUrl);

  if (ready) {
    win.loadURL(devUrl);
  } else {
    win.loadURL('data:text/html,<h2>⚠️ Failed to start server at localhost:3000</h2>');
  }

  win.show(); // chỉ show sau khi load xong
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
