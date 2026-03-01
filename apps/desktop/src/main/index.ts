import { app, globalShortcut } from 'electron/main';
import { createMainWindow } from './main-window';
import { setupScreenShareRequestHandler } from './screen-sharing';
import { initTray } from './tray';

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.commandLine.appendSwitch('disable-quic');
  app.commandLine.appendSwitch('ignore-gpu-blocklist');
  app.commandLine.appendSwitch(
    'enable-features',
    'GlobalShortcutsPortal,AcceleratedVideoEncoder,AcceleratedVideoDecoder,AcceleratedVideoDecodeLinuxZeroCopyGL,VaapiVideoEncoder,VaapiVideoDecoder'
  );

  app.whenReady().then(() => {
    const mainWindow = createMainWindow();
    initTray(mainWindow);
    setupScreenShareRequestHandler();

    app.on('second-instance', () => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        if (!mainWindow.isVisible()) mainWindow.show();
        mainWindow.focus();
      }
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('will-quit', () => {
    console.log('Unregistering shortcuts...');
    globalShortcut.unregisterAll();
  });
}
