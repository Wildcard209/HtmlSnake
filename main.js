const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

const isDev = process.argv.includes('--dev');

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 700,
        title: 'HTMLSSnake',
        icon: path.join(__dirname, 'src/assets/images/icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'src/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    if (!isDev) {
        Menu.setApplicationMenu(null);
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
