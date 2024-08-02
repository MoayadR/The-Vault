const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('messages', {
    sendMasterPassword: (masterPassword) => ipcRenderer.send('createMasterPassword', masterPassword),
})