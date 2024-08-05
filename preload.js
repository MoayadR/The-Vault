const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('messages', {
    createMasterPassword: (masterPassword) => ipcRenderer.send('createMasterPassword', masterPassword),
    verifyMasterPassword: (masterPasswordInput) => ipcRenderer.invoke('verifyMasterPassword', masterPasswordInput),
})