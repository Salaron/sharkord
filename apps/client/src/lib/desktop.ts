import { requestScreenShareSelection } from '@/features/dialogs/actions';
import {
  getLocalStorageItemBool,
  LocalStorageKey,
  setLocalStorageItemBool
} from '@/helpers/storage';
import { type TScreenShareSource } from '@sharkord/shared';

if (typeof SharkordDesktop === 'undefined') {
  globalThis.SharkordDesktop = undefined;
}

const isDesktopApp = (): boolean => {
  return !!SharkordDesktop;
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

    if (selection != null) {
      setLocalStorageItemBool(
        LocalStorageKey.SCREEN_SHARE_SYSTEM_AUDIO,
        selection.includeSystemAudio
      );
    }

    SharkordDesktop?.handleScreenShareSelection(selection);
  }
);

export { isDesktopApp };
