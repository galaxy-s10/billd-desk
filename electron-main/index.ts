import path from 'path';

// import { mouse } from '@nut-tree/nut-js';
import { BrowserWindow, app, desktopCapturer, ipcMain } from 'electron';

const nutjs = require('@nut-tree/nut-js');

// 该版本electron所对应的node版本
console.log('process.version', process.version);
// electron 版本
console.log('process.versions.electron', process.versions.electron);
// abi
console.log('process.versions.modules', process.versions.modules);

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public');

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null;

async function getScreenStream() {
  const inputSources = await desktopCapturer.getSources({
    types: ['screen'],
  });
  const res: any[] = [];
  Object.keys(inputSources).forEach((key) => {
    const source = inputSources[key];
    if (!res.length) {
      res.push(source);
    }
  });
  win?.webContents.send('getScreenStream', res[0]);
}

function createWindow() {
  win = new BrowserWindow({
    // @ts-ignore
    icon: path.join(process.env.VITE_PUBLIC, 'logo.svg'),
    webPreferences: {
      devTools: true,
      nodeIntegration: true, // 在网页中集成Node
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  ipcMain.on('mouseSetPosition', async (_event, x, y) => {
    console.log('收到mouseSetPosition', x, y);
    try {
      await nutjs.mouse.setPosition({ x, y });
      win?.webContents.send('mouseSetPositionRes', {
        isErr: false,
        msg: { x, y },
      });
    } catch (error) {
      win?.webContents.send('mouseSetPositionRes', {
        isErr: true,
        msg: JSON.stringify(error),
      });
    }
  });
  ipcMain.on('mouseLeftClick', async (_event, x, y) => {
    console.log('收到mouseLeftClick', x, y);
    try {
      await nutjs.mouse.click(nutjs.Button.LEFT);
      win?.webContents.send('mouseLeftClickRes', {
        isErr: false,
        msg: { x, y },
      });
    } catch (error) {
      win?.webContents.send('mouseLeftClickRes', {
        isErr: true,
        msg: JSON.stringify(error),
      });
    }
  });
  ipcMain.on('mouseRightClick', async (_event, x, y) => {
    console.log('收到mouseRightClick', x, y);
    try {
      await nutjs.mouse.click(nutjs.Button.RIGHT);
      win?.webContents.send('mouseRightClickRes', {
        isErr: false,
        msg: { x, y },
      });
    } catch (error) {
      win?.webContents.send('mouseRightClickRes', {
        isErr: true,
        msg: JSON.stringify(error),
      });
    }
  });
  ipcMain.on('testnutjs', async (_event, x, y) => {
    console.log('收到testnutjs', x, y);
    win?.webContents.openDevTools();
    try {
      await nutjs.mouse.setPosition({ x: 30, y: 30 });
      win?.webContents.send('ddd', { msg: 'ok' });
    } catch (error) {
      console.error(error);
      win?.webContents.send('ddd', { msg: JSON.stringify(error) });
    }
  });
  ipcMain.on('getMousePosition', async () => {
    console.log('收到getMousePosition');
    const point = await nutjs.mouse.getPosition();
    console.log(point);
    win?.webContents.send('getMousePositionRes', {
      point,
    });
  });
  ipcMain.on('getScreenStream', () => {
    console.log('收到getScreenStream');
    getScreenStream();
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', (event) => {
    console.log('did-finish-load事件', event);
    // import('@nut-tree/nut-js').then((res) => {
    //   console.log(res, 777);
    // });
  });
  win.webContents.openDevTools();
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    // win.webContents.openDevTools();
  } else {
    // @ts-ignore
    win.loadFile(path.join(process.env.DIST, 'index.html'));
  }
}

app.on('window-all-closed', () => {
  app.quit();
  win = null;
});

app.whenReady().then(createWindow);
