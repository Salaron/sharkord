import { IconButton } from '@sharkord/ui';
import { Maximize, Minimize } from 'lucide-react';
import { memo } from 'react';

type TFullScreenButtonProps = {
  isFullScreen: boolean;
  handleToggleFullScreen: () => void;
};

const FullScreenButton = memo(
  ({ isFullScreen, handleToggleFullScreen }: TFullScreenButtonProps) => {
    return (
      <IconButton
        variant={isFullScreen ? 'default' : 'ghost'}
        icon={isFullScreen ? Minimize : Maximize}
        onClick={handleToggleFullScreen}
        title={isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        size="sm"
      />
    );
  }
);

export { FullScreenButton };
