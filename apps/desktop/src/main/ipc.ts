import {
  IpcChannels,
  type TScreenShareSelection,
  type TScreenShareSource,
  type TShortcut
} from '@sharkord/shared';
import { BrowserWindow, ipcMain } from 'electron';
import logger from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { registerShortcuts } from './global-shortcuts';
import { mainWindow } from './main-window';

const getScreenShareSelection = (
  sources: TScreenShareSource[]
): Promise<TScreenShareSelection> => {
  return new Promise((resolve, reject) => {
    if (!mainWindow) {
      reject('Main window is not available');
      return;
    }

    ipcMain.once(IpcChannels.SCREEN_SHARE_SELECTION, (_event, result) => {
      resolve(result);
    });

    mainWindow.webContents.send(IpcChannels.SCREEN_SHARE_PICKER, sources);
  });
};

const toggleMic = () => {
  mainWindow?.webContents.send(IpcChannels.TOGGLE_MIC);
};

const toggleSound = () => {
  mainWindow?.webContents.send(IpcChannels.TOGGLE_SOUND);
};

const updateDownloadedNotify = (version: string) => {
  mainWindow?.webContents.send(IpcChannels.UPDATE_DOWNLOADED, version);
};

ipcMain.on(IpcChannels.REGISTER_SHORTCUTS, (_, shortcuts: TShortcut[]) => {
  registerShortcuts(shortcuts);
});

ipcMain.on(IpcChannels.OPEN_DEBUG, () => {
  const gpu = new BrowserWindow();
  gpu.loadURL('chrome://gpu');

  const webrtc = new BrowserWindow();
  webrtc.loadURL('chrome://webrtc-internals');
});

ipcMain.on(IpcChannels.INSTALL_UPDATE, () => {
  autoUpdater.quitAndInstall();
});

ipcMain.on(IpcChannels.CHECK_UPDATES, () => {
  autoUpdater.checkForUpdates().catch(logger.error);
});

export {
  getScreenShareSelection,
  toggleMic,
  toggleSound,
  updateDownloadedNotify
};
