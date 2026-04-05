import logger from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { app, globalShortcut } from 'electron/main';
import { updateDownloadedNotify } from './ipc';
import { createMainWindow } from './main-window';
import { setupScreenShareRequestHandler } from './screen-sharing';
import { initTray } from './tray';

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.commandLine.appendSwitch('disable-quic');
  app.commandLine.appendSwitch('enable-features', 'GlobalShortcutsPortal');

  app.whenReady().then(() => {
    const mainWindow = createMainWindow();
    initTray(mainWindow);
    setupScreenShareRequestHandler();

    autoUpdater.allowPrerelease = false;
    autoUpdater.logger = logger;
    autoUpdater.on('update-downloaded', (ev) =>
      updateDownloadedNotify(ev.version)
    );

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
    logger.log('Unregistering shortcuts...');
    globalShortcut.unregisterAll();
  });
}
