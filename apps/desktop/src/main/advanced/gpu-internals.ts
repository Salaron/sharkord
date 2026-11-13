import { BrowserWindow } from 'electron';

const openGpuInternalsWindow = () => {
  const gpu = new BrowserWindow();
  gpu.loadURL('chrome://gpu');
};

export { openGpuInternalsWindow };
