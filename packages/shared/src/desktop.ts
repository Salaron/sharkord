export enum IpcChannels {
  SCREEN_SHARE_PICKER = 'sharkord:screen_share_picker',
  SCREEN_SHARE_SELECTION = 'sharkord:screen_share_selection',
  REGISTER_SHORTCUTS = 'sharkord:register_shortcuts',
  TOGGLE_MIC = 'sharkord:toggle_mic',
  TOGGLE_SOUND = 'sharkord:toggle_sound',
  OPEN_DEBUG = 'sharkord:open_debug',
  CHECK_UPDATES = 'sharkord:check_updateS',
  UPDATE_DOWNLOADED = 'sharkord:update_downloaded',
  INSTALL_UPDATE = 'sharkord:install_update'
}

export type TScreenShareSourceKind = 'screen' | 'window';

export type TScreenShareSource = {
  id: string;
  name: string;
  kind: TScreenShareSourceKind;
  thumbnailDataUrl: string;
  appIconDataUrl?: string;
};

export type TScreenShareSelection = {
  sourceId: string;
  includeSystemAudio: boolean;
};

export type TSharkordDesktop = {
  onShowScreenSharePicker: (
    cb: (soucres: TScreenShareSource[]) => Promise<void>
  ) => void;
  handleScreenShareSelection: (selection: TScreenShareSelection | null) => void;
  toggleMic: (cb: () => void) => () => void;
  toggleSound: (cb: () => void) => () => void;
  registerShortcuts: (shortcuts: TShortcut[]) => void;
  openDebug: () => void;
  onUpdateDownloaded: (callback: (version: string) => void) => void;
  installUpdate: () => void;
  checkUpdates: () => void;
};

export type TShortcut = {
  keybind: string;
  action: ShortcutAction;
};

export enum ShortcutAction {
  TOGGLE_MIC = 'toggle_mic',
  TOGGLE_SOUND = 'toggle_sound',
  MUTE = 'mute',
  UNMUTE = 'unmute',
  DEAFEAN = 'deafean',
  UNDEAFEAN = 'undeafean'
}
