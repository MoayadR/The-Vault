const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('messages', {
    createMasterPassword: (masterPassword) => ipcRenderer.send('createMasterPassword', masterPassword),
    verifyMasterPassword: (masterPasswordInput) => ipcRenderer.invoke('verifyMasterPassword', masterPasswordInput),
    openCreateNewPassword: () => ipcRenderer.send('openCreateNewPassword'),
    createPassword: (data) => ipcRenderer.send('createPassword', data),
    getAllPasswords: async () => ipcRenderer.invoke('getAllPasswords'),
    deletePassword: (id) => ipcRenderer.send('deletePassword', id),
    openEditPassword: (passwordObj) => ipcRenderer.send('openEditPassword', passwordObj),
    recievePasswordObj: (callback) => ipcRenderer.on('passwordObj', (event, data) => callback(data)),
    editPassword: (passwordObj) => ipcRenderer.send('editPassword', passwordObj)
})