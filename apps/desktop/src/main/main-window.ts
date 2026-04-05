import { app, BrowserWindow, shell } from 'electron';
import path from 'path';

const RENDERER_URL = process.env.ELECTRON_RENDERER_URL;

let mainWindow: BrowserWindow | null = null;
let quitting = false;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  mainWindow.setMenuBarVisibility(false);

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('close', (ev) => {
    if (quitting) return;

    ev.preventDefault();
    mainWindow?.hide();
    return false;
  });

  mainWindow.webContents.on('will-prevent-unload', (event) => {
    event.preventDefault();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (RENDERER_URL) {
    mainWindow.loadURL(RENDERER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
  }

  return mainWindow;
};

const quit = () => {
  quitting = true;
  app.quit();
};

export { createMainWindow, mainWindow, quit };
