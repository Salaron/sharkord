import { type TScreenShareSource } from '@sharkord/shared';
import { desktopCapturer, session, type Streams } from 'electron';
import { getScreenShareSelection } from './ipc';

const setupScreenShareRequestHandler = (): void => {
  session.defaultSession.setDisplayMediaRequestHandler(async (_, callback) => {
    try {
      const width = 640;
      const desktopCaptureSources = await desktopCapturer.getSources({
        types: ['screen', 'window'],
        fetchWindowIcons: true,
        thumbnailSize: {
          width: width,
          height: width * (9 / 16)
        }
      });

      const screenShareSources = (
        desktopCaptureSources ?? []
      ).map<TScreenShareSource>((source) => {
        return {
          id: source.id,
          name: source.name,
          kind: source.id.startsWith('screen:') ? 'screen' : 'window',
          thumbnailDataUrl: source.thumbnail.toDataURL(),
          appIconDataUrl: source.appIcon?.toDataURL()
        };
      });

      const selection = await getScreenShareSelection(screenShareSources);
      const selectedSource = screenShareSources.find(
        (source) => source.id === selection?.sourceId
      );
      if (!selectedSource) {
        callback({});
        return;
      }

      const streams: Streams = {
        video: selectedSource
      };

      if (selection.includeSystemAudio)
        // https://github.com/chromium/chromium/blob/3633b670e86af329be8ecfe3d73ba9f927f48bb3/media/audio/audio_device_description.cc#L26
        streams.audio = 'loopbackWithoutChrome' as any;

      callback(streams);
    } catch (err) {
      console.error(err);
      callback({});
    }
  });
};

export { setupScreenShareRequestHandler };
