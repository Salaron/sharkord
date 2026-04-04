import {
  IpcChannels,
  type TScreenShareSelection,
  type TScreenShareSource,
  type TSharkordDesktop
} from '@sharkord/shared';
import { contextBridge, ipcRenderer } from 'electron';

const SharkordDesktop: TSharkordDesktop = {
  showScreenSharePicker(cb: (soucres: TScreenShareSource[]) => Promise<void>) {
    ipcRenderer.on(IpcChannels.SCREEN_SHARE_PICKER, (_, sources) =>
      cb(sources)
    );
  },
  handleScreenShareSelection: (selection: TScreenShareSelection | null) => {
    ipcRenderer.send(IpcChannels.SCREEN_SHARE_SELECTION, selection);
  }
};

contextBridge.exposeInMainWorld('SharkordDesktop', SharkordDesktop);
