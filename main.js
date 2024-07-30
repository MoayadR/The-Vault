const { app, BrowserWindow } = require('electron')

const createWindow = (winPath) => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    win.loadFile(winPath)
}

app.whenReady().then(() => {
    createWindow('pages/index.html')

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow('pages/index.html')
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
