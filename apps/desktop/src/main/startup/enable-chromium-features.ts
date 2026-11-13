import { app } from 'electron';

// va-api encode and decode on linux, checked against the feature names in electron's chromium
const HARDWARE_VIDEO_CODECS = [
  'AcceleratedVideoEncoder',
  'AcceleratedVideoDecodeLinuxGL',
  'AcceleratedVideoDecodeLinuxZeroCopyGL',
  'VaapiIgnoreDriverChecks',
  'VaapiVideoDecoder',
  'VaapiVideoEncoder',
  'UseMultiPlaneFormatForHardwareVideo'
];

const enableChromiumFeatures = () => {
  const userValue = app.commandLine.getSwitchValue('enable-features');
  const userFeatures = userValue.split(',');
  const features = new Set([...userFeatures, ...HARDWARE_VIDEO_CODECS]);

  features.delete('');

  app.commandLine.appendSwitch('ignore-gpu-blacklist');
  app.commandLine.appendSwitch('enable-gpu-rasterization');
  app.commandLine.appendSwitch('enable-zero-copy');
  app.commandLine.appendSwitch('webrtc-max-cpu-consumption-percentage', '100');
  app.commandLine.appendSwitch('enable-accelerated-video-decode');
  app.commandLine.appendSwitch('enable-accelerated-video-encode');

  app.commandLine.appendSwitch('enable-features', [...features].join(','));
};

export { enableChromiumFeatures };
