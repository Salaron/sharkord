import { requestScreenShareSelection } from '@/features/dialogs/actions';
import {
  getLocalStorageItemBool,
  LocalStorageKey,
  setLocalStorageItemBool
} from '@/helpers/storage';
import { type TScreenShareSource, type TShortcut } from '@sharkord/shared';

if (typeof SharkordDesktop === 'undefined') {
  globalThis.SharkordDesktop = undefined;
}

const isDesktopApp = (): boolean => {
  return !!SharkordDesktop;
};

const registerShortcuts = (shortcuts: TShortcut[]) => {
  SharkordDesktop?.registerShortcuts(shortcuts);
};

SharkordDesktop?.showScreenSharePicker(
  async (sources: TScreenShareSource[]) => {
    const includeSystemAudio = getLocalStorageItemBool(
      LocalStorageKey.SCREEN_SHARE_SYSTEM_AUDIO
    );

    const selection = await requestScreenShareSelection({
      sources,
      includeSystemAudio
    });

    if (selection) {
      setLocalStorageItemBool(
        LocalStorageKey.SCREEN_SHARE_SYSTEM_AUDIO,
        selection.includeSystemAudio
      );
    }

    SharkordDesktop?.handleScreenShareSelection(selection);
  }
);

export { isDesktopApp, registerShortcuts };
