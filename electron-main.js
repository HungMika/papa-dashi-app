const { app, BrowserWindow } = require('electron');
const path = require('path');
const ElectronStore = require('electron-store').default;  // Sửa chỗ này
const store = new ElectronStore();

console.log('Electron Store path:', store.path);


function createWindow() {
  console.log('App name:', app.getName());

  const win = new BrowserWindow({
  show: false, // ẩn trước khi sẵn sàng
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    preload: path.join(__dirname, 'preload.js'),
  },
});

win.maximize();     // phóng to
win.show();         // hiển thị sau khi maximize để tránh nháy


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
