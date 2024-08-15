const { app, BrowserWindow, screen, ipcMain } = require('electron')
const path = require('node:path')
const { createDB, getMasterPassword, createMasterPassword, createNewPassword, getAllPasswords, deletePassword, editPassword } = require('./sqlite.js');
const { encrypt, decrypt } = require('./utils/security/encryption.js');


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
    return win;
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
    return win;
}

app.whenReady().then(async () => {
    try {
        await createDB();
    } catch (error) {
        console.log(error);
    }

    const masterPasswordObj = await getMasterPassword();
    let mainScreen = null;

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
        let passwordObjs = await getAllPasswords();
        for (let obj of passwordObjs) {
            obj.password = decrypt(obj.password);
        }
        return passwordObjs;
    });

    ipcMain.on("openCreateNewPassword", async (event, data) => {
        createPopup('pages/CreatePopup/createpopup.html', 'preload.js');
    })

    ipcMain.on('createPassword', async (event, data) => {
        data.password = encrypt(data.password);
        const status = await createNewPassword(data);

        if (status === true) {
            const win = BrowserWindow.getFocusedWindow();
            win.close();

            // like setting the state
            mainScreen.reload();
        }
    });

    ipcMain.on('deletePassword', async (event, data) => {
        res = await deletePassword(data);
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

        res = await editPassword(data);
        if (res) {
            let window = BrowserWindow.getFocusedWindow();
            window.close();

            mainScreen.reload();
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

    mainScreen = createWindow(initialWindow, 'preload.js');

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) mainScreen = createWindow(initialWindow, 'preload.js');
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
