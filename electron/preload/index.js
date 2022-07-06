const { app, ipcRenderer, shell, contextBridge } = require('electron');



document.addEventListener('DOMContentLoaded', () => {
	window.addEventListener('offline', () => ipcRenderer.send('offline'))
	window.addEventListener('online', () => ipcRenderer.send('online'))
})