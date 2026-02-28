import { BrowserWindow, Menu, Tray } from 'electron';
import path from 'path';
import { quit } from './main-window';

const initTray = (mainWindow: BrowserWindow) => {
  const trayMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      click() {
        mainWindow.show();
      }
    },
    {
      label: 'Quit',
      click() {
        quit();
      }
    }
  ]);

  const tray = new Tray(path.join(__dirname, 'tray.png'));
  tray.setTitle('Sharkord');
  tray.setContextMenu(trayMenu);
  tray.on('click', () => {
    if (mainWindow.isVisible()) mainWindow.hide();
    else mainWindow.show();
  });
};

export { initTray };
