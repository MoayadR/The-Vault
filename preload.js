const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('messages', {
    createMasterPassword: (masterPassword) => ipcRenderer.send('createMasterPassword', masterPassword),
    verifyMasterPassword: (masterPasswordInput) => ipcRenderer.invoke('verifyMasterPassword', masterPasswordInput),
    openCreateNewPassword: () => ipcRenderer.send('openCreateNewPassword'),
    createPassword: (data) => ipcRenderer.send('createPassword', data),
    getAllPasswords: async () => ipcRenderer.invoke('getAllPasswords'),
})