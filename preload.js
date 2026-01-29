const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    sendMail: (files) => ipcRenderer.invoke('send-mail', files),
    settings: {
        get: () => ipcRenderer.invoke('get-settings'),
        save: (data) => ipcRenderer.invoke('save-settings', data)
    },
    window: {
        close: () => ipcRenderer.send('window-close'),
        minimize: () => ipcRenderer.send('window-minimize')
    }
});
