export enum IpcChannels {
  SCREEN_SHARE_PICKER = 'sharkord:screen_share_picker',
  SCREEN_SHARE_SELECTION = 'sharkord:screen_share_selection'
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
  showScreenSharePicker: (cb: (soucres: TScreenShareSource[]) => Promise<void>) => void;
  handleScreenShareSelection: (selection: TScreenShareSelection | null) => void;
};
