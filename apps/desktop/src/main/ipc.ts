import {
  IpcChannels,
  type TScreenShareSelection,
  type TScreenShareSource,
  type TShortcut
} from '@sharkord/shared';
import { ipcMain } from 'electron';
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

ipcMain.on(IpcChannels.REGISTER_SHORTCUTS, (_, shortcuts: TShortcut[]) => {
  registerShortcuts(shortcuts);
});

export { getScreenShareSelection, toggleSound, toggleMic };
