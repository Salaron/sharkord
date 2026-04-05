import {
  IpcChannels,
  type TScreenShareSelection,
  type TScreenShareSource,
  type TSharkordDesktop,
  type TShortcut
} from '@sharkord/shared';
import { contextBridge, ipcRenderer } from 'electron';

const SharkordDesktop: TSharkordDesktop = {
  onShowScreenSharePicker(
    cb: (soucres: TScreenShareSource[]) => Promise<void>
  ) {
    ipcRenderer.on(IpcChannels.SCREEN_SHARE_PICKER, (_, sources) =>
      cb(sources)
    );
  },
  handleScreenShareSelection: (selection: TScreenShareSelection | null) => {
    ipcRenderer.send(IpcChannels.SCREEN_SHARE_SELECTION, selection);
  },
  registerShortcuts: (shortcuts: TShortcut[]) => {
    ipcRenderer.send(IpcChannels.REGISTER_SHORTCUTS, shortcuts);
  },
  toggleMic: (cb: () => void) => {
    ipcRenderer.on(IpcChannels.TOGGLE_MIC, cb);

    return () => {
      ipcRenderer.removeListener(IpcChannels.TOGGLE_MIC, cb);
    };
  },
  toggleSound: (cb: () => void) => {
    ipcRenderer.on(IpcChannels.TOGGLE_SOUND, cb);

    return () => {
      ipcRenderer.removeListener(IpcChannels.TOGGLE_SOUND, cb);
    };
  },
  openDebug: () => {
    ipcRenderer.send(IpcChannels.OPEN_DEBUG);
  },
  onUpdateDownloaded: (callback: (version: string) => void) => {
    ipcRenderer.on(IpcChannels.UPDATE_DOWNLOADED, (_, version: string) => {
      callback(version);
    });
  },
  installUpdate: () => {
    ipcRenderer.send(IpcChannels.INSTALL_UPDATE);
  },
  checkUpdates: () => {
    ipcRenderer.send(IpcChannels.CHECK_UPDATES);
  }
};

contextBridge.exposeInMainWorld('SharkordDesktop', SharkordDesktop);
