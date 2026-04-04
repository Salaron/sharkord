import {
  IpcChannels,
  type TScreenShareSelection,
  type TScreenShareSource
} from '@sharkord/shared';
import { ipcMain } from 'electron';
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

export { getScreenShareSelection };
