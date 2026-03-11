import {
  requestConfirmation,
  requestScreenShareSelection
} from '@/features/dialogs/actions';
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

const checkUpdates = () => {
  SharkordDesktop?.checkUpdates();
};

SharkordDesktop?.onShowScreenSharePicker(
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

SharkordDesktop?.onUpdateDownloaded(async (version: string) => {
  await requestConfirmation({
    title: 'Update available',
    message: `Version ${version} is available. Do you want to install it now?`,
    confirmLabel: 'Install now',
    cancelLabel: 'Install later',
    onConfirm: () => {
      SharkordDesktop?.installUpdate();
    }
  });
});

export { checkUpdates, isDesktopApp, registerShortcuts };
