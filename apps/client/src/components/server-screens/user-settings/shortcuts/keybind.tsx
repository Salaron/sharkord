import { Button } from '@sharkord/ui';
import { Trash } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';

type TKeybindProps = {
  keybind: string | undefined;
  onKeybindChange: (keybind: string | undefined) => void;
};

const Keybind = memo(({ keybind, onKeybindChange }: TKeybindProps) => {
  const [isCapturingKeybind, setCapturingKeybind] = useState(false);
  const [currentKeybind, setCurrentKeybind] = useState(keybind);

  const resetKeybind = useCallback(() => {
    setCurrentKeybind(undefined);
    onKeybindChange(undefined);
  }, [setCurrentKeybind, onKeybindChange]);

  const formatKeybind = useCallback(() => {
    if (!currentKeybind) return 'Not set';

    return currentKeybind;
  }, [currentKeybind]);

  useEffect(() => {
    const modifiers = [
      'Control',
      'Command',
      'Meta',
      'Alt',
      'Shift',
      'Super',
      'Option'
    ];

    if (!isCapturingKeybind) return;

    const onKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();

      console.log(event);

      if (event.key === 'Escape') {
        setCapturingKeybind(false);
        return;
      }

      if (modifiers.includes(event.key)) return;

      const compose = [];
      if (event.ctrlKey) compose.push('Ctrl');
      if (event.altKey) compose.push('Alt');
      if (event.shiftKey) compose.push('Shift');
      if (event.metaKey) compose.push('Meta');

      let key = event.key;
      if (event.code.includes('Numpad')) {
        key = `num${event.key}`;
      }

      compose.push(key);

      const result = compose.join(' + ');

      setCurrentKeybind(result);
      onKeybindChange(result);
      setCapturingKeybind(false);
    };

    window.addEventListener('keydown', onKeyDown, true);

    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
    };
  }, [isCapturingKeybind, onKeybindChange]);

  return (
    <div className="flex items-center gap-2">
      <Button
        className="w-50"
        variant={isCapturingKeybind ? 'default' : 'outline'}
        type="button"
        onClick={() => setCapturingKeybind(true)}
      >
        {isCapturingKeybind ? 'Press keys...' : formatKeybind()}
      </Button>

      <Button
        className="w-10"
        variant="ghost"
        type="button"
        onClick={resetKeybind}
      >
        <Trash />
      </Button>
    </div>
  );
});

export { Keybind };
