const { app, BrowserWindow, ipcMain, shell, Tray, Menu, screen } = require('electron');
const path = require('path');
const Store = require('electron-store');
const { sendMail } = require('./services/mailer');

const store = new Store();

let tray = null;
let mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        show: false, // Start hidden, toggle via tray
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
        titleBarStyle: 'hidden',
        transparent: true,
        backgroundColor: '#00000000',
        frame: false,
        hasShadow: true,
        resizable: false,
        alwaysOnTop: true, // Fix for window hiding during drag
        skipTaskbar: true,
        icon: path.join(__dirname, 'assets/icon.png')
    });

    mainWindow.loadFile('index.html');

    // Window behavior: Don't hide on blur to allow drag & drop
    // mainWindow.on('blur', () => { ... });
}

function createTray() {
    const iconPath = path.join(__dirname, 'assets/icon.png');
    tray = new Tray(iconPath);

    tray.setToolTip('File Hub');

    tray.on('click', () => {
        toggleWindow();
    });

    const contextMenu = Menu.buildFromTemplate([
        { label: 'File Hub', enabled: false },
        { type: 'separator' },
        { label: 'Göster', click: () => toggleWindow() },
        {
            label: 'Çıkış', click: () => {
                app.isQuitting = true;
                app.quit();
            }
        }
    ]);

    tray.setContextMenu(contextMenu);
}

function toggleWindow(x, y) {
    if (mainWindow.isVisible()) {
        mainWindow.hide();
    } else {
        const windowBounds = mainWindow.getBounds();

        // Calculate position
        const cursorPoint = screen.getCursorScreenPoint();
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width, height } = primaryDisplay.workAreaSize;

        // Default to centering horizontally under cursor, slightly below top bar
        let newX = cursorPoint.x - (windowBounds.width / 2);
        let newY = 32; // Assuming top bar height approx 30-40px

        // Adjust if off screen
        if (newX + windowBounds.width > width) newX = width - windowBounds.width - 10;
        if (newX < 10) newX = 10;

        mainWindow.setPosition(Math.round(newX), Math.round(newY));
        mainWindow.show();
    }
}

app.whenReady().then(() => {
    createTray();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // Keep running
    }
});

// --- IPC Handlers ---

// Settings
ipcMain.handle('get-settings', () => {
    return {
        email: store.get('email', ''),
        appPassword: store.get('appPassword', ''),
        autoStart: store.get('autoStart', false),
        notifications: store.get('notifications', true)
    };
});

ipcMain.handle('save-settings', (event, settings) => {
    store.set(settings);

    // Configure Auto Launch
    app.setLoginItemSettings({
        openAtLogin: settings.autoStart === true,
        path: app.getPath('exe') // Optional but good for safety
    });

    return { success: true };
});

// Email Sending
ipcMain.handle('send-mail', async (event, files) => {
    const email = store.get('email');
    const appPassword = store.get('appPassword');

    if (!email || !appPassword) {
        throw new Error('E-posta ayarları eksik. Lütfen ayarlardan yapılandırın.');
    }

    try {
        const result = await sendMail({
            user: email,
            pass: appPassword,
            to: email, // Sending to self
            subject: 'File Hub Uploads',
            text: 'Dosyalarınız ektedir.',
            files: files
        });
        return result;
    } catch (error) {
        console.error('Mail sending error:', error);
        throw new Error(error.message || 'Gönderim sırasında hata oluştu.');
    }
});

// Window Controls
ipcMain.on('window-close', () => {
    mainWindow.hide();
});

ipcMain.on('window-minimize', () => {
    mainWindow.hide();
});
