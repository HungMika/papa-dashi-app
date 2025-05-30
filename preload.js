const { contextBridge } = require('electron');
const fs = require('fs');
const path = require('path');

contextBridge.exposeInMainWorld('electronAPI', {
  readImage: (imagePath) => {
    const ext = path.extname(imagePath).toLowerCase();

    let mimeType = '';
    if (ext === '.jpg' || ext === '.jpeg') {
      mimeType = 'image/jpeg';
    } else if (ext === '.png') {
      mimeType = 'image/png';
    } else if (ext === '.gif') {
      mimeType = 'image/gif';
    } else if (ext === '.bmp') {
      mimeType = 'image/bmp';
    } else if (ext === '.webp') {
      mimeType = 'image/webp';
    } else {
      throw new Error(`Unsupported image type: ${ext}`);
    }

    try {
      const file = fs.readFileSync(imagePath);
      return `data:${mimeType};base64,${file.toString('base64')}`;
    } catch (err) {
      console.error('Failed to read image:', imagePath, err);
      return '';
    }
  },
});
