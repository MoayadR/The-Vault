const { app, BrowserWindow, screen, ipcMain } = require('electron')
const path = require('node:path')
const { createDB, getMasterPassword, closeDB, createMasterPassword, createNewPassword, getAllPasswords } = require('./sqlite.js');
const { encrypt, decrypt } = require('./encryption.js');


const createWindow = (winPath, preloadPath) => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const win = new BrowserWindow({
        width, height,
        webPreferences: {
            preload: path.join(__dirname, preloadPath)
        }
    })
    win.openDevTools();

    win.removeMenu();
    win.loadFile(winPath)
}

const createPopup = (winPath, preloadPath) => {
    const win = new BrowserWindow({
        width: 400, height: 400,
        webPreferences: {
            preload: path.join(__dirname, preloadPath)
        }
    })
    win.openDevTools();

    win.removeMenu();
    win.loadFile(winPath)
}

app.whenReady().then(async () => {
    try {
        await createDB();
    } catch (error) {
        console.log(error);
    }

    const masterPasswordObj = await getMasterPassword();

    let masterPassword;
    if (masterPasswordObj !== undefined)
        masterPassword = masterPasswordObj.password;
    else
        masterPassword = undefined;

    ipcMain.handle("verifyMasterPassword", async (event, data) => {
        if (data === decrypt(masterPassword)) {
            // oopen the home window 
            const currentWindow = BrowserWindow.getAllWindows()[0];
            currentWindow.loadFile('pages/Home/home.html');
            return true;
        }
        return false;
    });

    ipcMain.handle('getAllPasswords', async () => {
        return await getAllPasswords();
    });

    ipcMain.on("openCreateNewPassword", async (event, data) => {
        createPopup('pages/Popup/popup.html', 'preload.js');
    })

    ipcMain.on('createPassword', async (event, data) => {
        const status = await createNewPassword(data);

        if (status === true) {
            const win = BrowserWindow.getFocusedWindow();
            win.close();
        }
    });

    ipcMain.on("createMasterPassword", async (event, data) => {
        // if there is a masterpassword return

        if (masterPassword && Object.keys(masterPassword).length !== 0) return;

        // encrypt the master password
        const encryptedMasterPassword = encrypt(data);

        // save it to the db
        try {
            const statusFlag = await createMasterPassword(encryptedMasterPassword);
            if (statusFlag) {
                // load the new window
                const currentWindow = BrowserWindow.getAllWindows()[0];
                currentWindow.loadFile('pages/Home/home.html');
            }

        } catch (error) {
            console.log(error);
            /*
                Error Handling
                =============================================================================================================
            */
        }

    })

    let initialWindow = 'pages/Login/login.html';

    if (!masterPassword || Object.keys(masterPassword).length === 0) {
        initialWindow = 'pages/Register/register.html';
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
