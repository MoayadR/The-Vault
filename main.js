const { app, BrowserWindow, screen } = require('electron')
const path = require('node:path')


const createWindow = (winPath) => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const win = new BrowserWindow({
        width, height,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile(winPath)
}

app.whenReady().then(() => {
    createWindow('pages/index/index.html')

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow('pages/index/index.html')
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
