import { setShortcuts } from '@/features/app/actions';
import { shortcutsSelector } from '@/features/app/selectors';
import { closeServerScreens } from '@/features/server-screens/actions';
import { store } from '@/features/store';
import { ShortcutAction, type TShortcut } from '@sharkord/shared';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Group
} from '@sharkord/ui';
import { memo, useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Keybind } from './keybind';

const Shortcuts = memo(() => {
  const shortcuts = shortcutsSelector(store.getState());
  const toggleMicKeybind = shortcuts?.find(
    (s) => s.action === ShortcutAction.TOGGLE_MIC
  )?.keybind;
  const toggleSoundKeybind = shortcuts?.find(
    (s) => s.action === ShortcutAction.TOGGLE_SOUND
  )?.keybind;

  const [toggleMic, setToggleMic] = useState<string | undefined>(
    toggleMicKeybind
  );
  const [toggleSound, setToggleSound] = useState<string | undefined>(
    toggleSoundKeybind
  );

  const updateShortcuts = useCallback(() => {
    const shortcuts: TShortcut[] = [];

    if (toggleMic)
      shortcuts.push({
        keybind: toggleMic,
        action: ShortcutAction.TOGGLE_MIC
      });

    if (toggleSound)
      shortcuts.push({
        keybind: toggleSound,
        action: ShortcutAction.TOGGLE_SOUND
      });

    setShortcuts(shortcuts);
    toast.success('Shortcuts updated!');
  }, [toggleMic, toggleSound]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shortcuts</CardTitle>
        <CardDescription>Manage your shortcuts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Group label="Toggle mute">
          <Keybind
            keybind={toggleMic}
            onKeybindChange={(value) => setToggleMic(value)}
          />
        </Group>

        <Group label="Toggle defeat">
          <Keybind
            keybind={toggleSound}
            onKeybindChange={(value) => setToggleSound(value)}
          />
        </Group>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={closeServerScreens}>
            Cancel
          </Button>
          <Button onClick={updateShortcuts}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
});

export { Shortcuts };
