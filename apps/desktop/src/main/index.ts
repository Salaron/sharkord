import { app } from 'electron';
import { createMainWindow } from './main-window';
import { setupScreenShareRequestHandler } from './screen-sharing';
import { initTray } from './tray';

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.commandLine.appendSwitch('disable-quic');

  app.whenReady().then(() => {
    const mainWindow = createMainWindow();
    initTray(mainWindow);
    setupScreenShareRequestHandler();

    mainWindow.on('close', (ev) => {
      ev.preventDefault();
      mainWindow.hide();
      return false;
    });

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
}
