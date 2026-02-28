import { cn } from '@/lib/utils';
import type {
  TScreenShareSelection,
  TScreenShareSource
} from '@sharkord/shared';
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Group,
  Switch
} from '@sharkord/ui';
import { memo, useEffect, useMemo, useState } from 'react';
import type { TDialogBaseProps } from '../types';

type TScreenSharePickerDialogProps = TDialogBaseProps & {
  sources: TScreenShareSource[];
  includeSystemAudio: boolean;
  onConfirm?: (selection: TScreenShareSelection) => void;
  onCancel?: () => void;
};

const ScreenSharePickerDialog = memo(
  ({
    isOpen,
    sources,
    includeSystemAudio,
    onConfirm,
    onCancel
  }: TScreenSharePickerDialogProps) => {
    const [selectedSourceId, setSelectedSourceId] = useState(sources[0]?.id);
    const [shareSystemAudio, setShareSystemAudio] =
      useState(includeSystemAudio);

    const hasSources = sources.length > 0;

    const sourceLabel = useMemo(() => {
      if (!hasSources) {
        return 'No shareable sources were found.';
      }

      return `${sources.length} source${sources.length === 1 ? '' : 's'} available`;
    }, [hasSources, sources.length]);

    const onSubmit = () => {
      if (!selectedSourceId) {
        return;
      }

      onConfirm?.({
        sourceId: selectedSourceId,
        includeSystemAudio: shareSystemAudio
      });
    };

    const onCancelClick = () => {
      onCancel?.();
    };

    useEffect(() => {
      if (!isOpen) {
        return;
      }

      setSelectedSourceId(sources[0]?.id);
      setShareSystemAudio(includeSystemAudio);
    }, [isOpen, sources, includeSystemAudio]);

    return (
      <Dialog open={isOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Share Screen</DialogTitle>
            <DialogDescription>{sourceLabel}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
              {sources.map((source) => {
                const isSelected = selectedSourceId === source.id;

                return (
                  <button
                    type="button"
                    key={source.id}
                    onClick={() => setSelectedSourceId(source.id)}
                    className={cn(
                      'text-left rounded-md border transition-colors overflow-hidden',
                      isSelected
                        ? 'border-primary ring-2 ring-primary/30'
                        : 'border-border hover:border-primary/40'
                    )}
                  >
                    <img
                      src={source.thumbnailDataUrl}
                      alt={source.name}
                      className="h-36 w-full object-cover bg-muted"
                    />
                    <div className="p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">
                          {source.name}
                        </span>
                        <Badge variant="secondary" className="text-[10px]">
                          {source.kind}
                        </Badge>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div>
              <Group label="Share system audio">
                <Switch
                  checked={!!shareSystemAudio}
                  onCheckedChange={(checked) => setShareSystemAudio(checked)}
                />
              </Group>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={onCancelClick}>
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!hasSources || !selectedSourceId}
            >
              Share
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

export { ScreenSharePickerDialog };
