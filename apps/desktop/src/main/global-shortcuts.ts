import { ShortcutAction, type TShortcut } from '@sharkord/shared';
import { globalShortcut } from 'electron/main';
import { toggleMic, toggleSound } from './ipc';

const registerShortcuts = (shortcuts: TShortcut[]) => {
  globalShortcut.unregisterAll();

  console.log('Registering shortcuts: ');
  console.log(shortcuts);

  for (const shortcut of shortcuts) {
    try {
      globalShortcut.register(shortcut.keybind, () => {
        console.log('Shortcut trigger:');
        console.log(shortcut);

        switch (shortcut.action) {
          case ShortcutAction.TOGGLE_MIC:
            toggleMic();
            break;
          case ShortcutAction.TOGGLE_SOUND:
            toggleSound();
            break;
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
};

export { registerShortcuts };
