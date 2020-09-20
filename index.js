// Modules to control application life and create native browser window
const {app, BrowserWindow, dialog, ipcMain} = require('electron')
const path = require('path')

require('electron-reload')(__dirname);

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 900,
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.loadFile('./windows/index.html')
  mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

ipcMain.on('asynchronous-message', async (event, arg) => {
const results = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  event.sender.send('asynchronous-reply', results)
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
