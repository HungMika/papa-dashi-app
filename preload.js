const { contextBridge } = require('electron');
const fs = require('fs');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

const sessionFilePath = path.join(__dirname, 'src', 'data', 'login-session.json');

contextBridge.exposeInMainWorld('electronAPI', {
  // Đọc ảnh local
  readImage: (imagePath) => {
    const ext = path.extname(imagePath).toLowerCase();

    let mimeType = '';
    if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
    else if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.gif') mimeType = 'image/gif';
    else if (ext === '.bmp') mimeType = 'image/bmp';
    else if (ext === '.webp') mimeType = 'image/webp';
    else throw new Error(`Unsupported image type: ${ext}`);

    try {
      const file = fs.readFileSync(imagePath);
      return `data:${mimeType};base64,${file.toString('base64')}`;
    } catch (err) {
      console.error('Failed to read image:', imagePath, err);
      return '';
    }
  },

  // SESSION: đọc file login-session.json
  getSession: () => {
    try {
      if (!fs.existsSync(sessionFilePath)) return null;
      const data = fs.readFileSync(sessionFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Failed to read session file:', err);
      return null;
    }
  },

  setSession: (sessionData) => {
    try {
      fs.writeFileSync(sessionFilePath, JSON.stringify(sessionData, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write session file:', err);
    }
  },

  clearSession: () => {
    try {
      if (fs.existsSync(sessionFilePath)) fs.unlinkSync(sessionFilePath);
    } catch (err) {
      console.error('Failed to clear session file:', err);
    }
  },

  // GENERAL: electron-store methods (giữ nguyên)
  getUserData: (key) => {
    try {
      return store.get(key) || null;
    } catch (err) {
      console.error('Failed to get user data:', key, err);
      return null;
    }
  },

  setUserData: (key, value) => {
    try {
      store.set(key, value);
    } catch (err) {
      console.error('Failed to set user data:', key, value, err);
    }
  },

  removeUserData: (key) => {
    try {
      store.delete(key);
    } catch (err) {
      console.error('Failed to remove user data:', key, err);
    }
  },
});
