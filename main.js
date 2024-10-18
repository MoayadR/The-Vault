const { app, BrowserWindow, screen, ipcMain, Tray, Menu } = require('electron');
const path = require('node:path');
const { createDB, getMasterPassword, createMasterPassword, createNewPassword, getAllPasswords, deletePassword, editPassword } = require('./sqlite.js');
const { encrypt, decrypt } = require('./utils/security/encryption.js');

let tray = null;  // Global variable for tray
let mainScreen = null; // Track the main window

const createWindow = (winPath, preloadPath) => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const win = new BrowserWindow({
        width, height,
        webPreferences: {
            preload: path.join(__dirname, preloadPath)
        },
        icon: path.join(__dirname, 'images/vault-icon.ico')
    });
    
    win.removeMenu();
    win.loadFile(winPath);
    
    // Intercept close event to minimize to tray
    win.on('close', (event) => {
        if (!app.isQuiting) {
            event.preventDefault();  // Prevent the window from closing
            win.hide();  // Hide the window (minimize to tray)
        }
    });
    
    return win;
};

const createPopup = (winPath, preloadPath) => {
    const win = new BrowserWindow({
        width: 400, height: 400,
        webPreferences: {
            preload: path.join(__dirname, preloadPath)
        },
        icon: path.join(__dirname, 'images/vault-icon.ico')
    });
    
    win.removeMenu();
    win.loadFile(winPath);
    return win;
};

app.whenReady().then(async () => {
    // Create the Tray icon and menu
    tray = new Tray(path.join(__dirname, 'images/vault-icon.ico'));  // Path to tray icon
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show App', click: () => { mainScreen.show(); } },  // Show the app window
        { label: 'Quit', click: () => {
            app.isQuiting = true;  // Set the flag to true before quitting
            app.quit();  // Quit the app
        }}
    ]);

    tray.setToolTip('Vault App');  // Tooltip for the tray icon
    tray.setContextMenu(contextMenu);  // Attach the menu to the tray icon

    // On click on the tray, show the window
    tray.on('click', () => {
        mainScreen.show();
    });

    // Database and password initialization
    try {
        await createDB();
    } catch (error) {
        console.log(error);
    }

    let masterPasswordObj;
    try {
        masterPasswordObj = await getMasterPassword();
    } catch (error) {
        console.log(error);
    }

    let masterPassword = undefined;
    if (masterPasswordObj !== undefined)
        masterPassword = masterPasswordObj.password;

    ipcMain.handle("verifyMasterPassword", async (event, data) => {
        if (data === decrypt(masterPassword)) {
            // Open the home window 
            mainScreen.loadFile('pages/Home/home.html');
            return true;
        }
        return false;
    });

    ipcMain.handle('getAllPasswords', async () => {
        let passwordObjs = [];
        try {
            passwordObjs = await getAllPasswords();
        } catch (error) {
            console.log(error);
        }

        for (let obj of passwordObjs) {
            obj.password = decrypt(obj.password);
        }
        return passwordObjs;
    });

    ipcMain.on("openCreateNewPassword", async (event, data) => {
        createPopup('pages/CreatePopup/createpopup.html', 'preload.js');
    });

    ipcMain.on('createPassword', async (event, data) => {
        data.password = encrypt(data.password);
        let status = false;
        try {
            status = await createNewPassword(data);
        } catch (error) {
            console.log(error);
        }

        if (status === true) {
            const win = BrowserWindow.getFocusedWindow();
            win.close();
            mainScreen.reload();
        }
    });

    ipcMain.on('deletePassword', async (event, data) => {
        let res = false;
        try {
            res = await deletePassword(data);
        } catch (error) {
            console.log(error);
        }
        if (res) mainScreen.reload();
    });

    ipcMain.on('openEditPassword', async (event, data) => {
        popup = createPopup('pages/EditPopup/editpopup.html', 'preload.js');
        popup.webContents.on('did-finish-load', () => {
            popup.webContents.send('passwordObj', data);
        });
    });

    ipcMain.on('editPassword', async (event, data) => {
        data.password = encrypt(data.password);
        let res = false;
        try {
            res = await editPassword(data);
        } catch (error) {
            console.log(error);
        }
        if (res) {
            let window = BrowserWindow.getFocusedWindow();
            window.close();
            mainScreen.reload();
        }
    });

    ipcMain.on("createMasterPassword", async (event, data) => {
        if (masterPassword && Object.keys(masterPassword).length !== 0) return;
        const encryptedMasterPassword = encrypt(data);
        try {
            const statusFlag = await createMasterPassword(encryptedMasterPassword);
            if (statusFlag) {
                const currentWindow = BrowserWindow.getAllWindows()[0];
                currentWindow.loadFile('pages/Home/home.html');
            }
        } catch (error) {
            console.log(error);
        }
    });

    let initialWindow = 'pages/Login/login.html';
    if (!masterPassword || Object.keys(masterPassword).length === 0) {
        initialWindow = 'pages/Register/register.html';
    }

    mainScreen = createWindow(initialWindow, 'preload.js');

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) mainScreen = createWindow(initialWindow, 'preload.js');
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
