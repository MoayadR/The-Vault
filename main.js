const { app, BrowserWindow, screen, ipcMain } = require('electron')
const path = require('node:path')
const { createDB, getMasterPassword, closeDB } = require('./sqlite.js');
const { encrypt, decrypt } = require('./encryption.js');


const createWindow = (winPath, preloadPath) => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const win = new BrowserWindow({
        width, height,
        webPreferences: {
            preload: path.join(__dirname, preloadPath)
        }
    })
    // win.openDevTools();

    win.loadFile(winPath)
}

app.whenReady().then(() => {
    createDB();
    const masterPassword = getMasterPassword();

    ipcMain.on("createMasterPassword", (event, data) => {
        // if there is a masterpassword return
        if (Object.keys(masterPassword).length !== 0) return;

        // encrypt the master password
        const encryptedMasterPassword = encrypt(data);
        console.log(encryptedMasterPassword);

        // save it to the db

        // load the new window
        const currentWindow = BrowserWindow.getAllWindows()[0];
        currentWindow.loadFile('pages/Home/index.html');
    })

    let initialWindow = 'pages/Login/login.html';

    if (Object.keys(masterPassword).length === 0) {
        initialWindow = 'pages/Register/register.html';
        console.log('no master password');
    }

    createWindow(initialWindow, 'preload.js')

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow(initialWindow, 'preload.js')
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
        closeDB();
    }
})
