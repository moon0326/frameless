var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;
var path = require('path');
var url = require('url');
var ipc = electron.ipcMain;
require('electron-debug')({
  showDevTools: false
});

let mainWindow = [];
let mainWindowIndex = 0;
let menuInited = false;

function bindMenu() {
  var template = [
      {
        label: "Application",
        submenu: [
            { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
            { type: "separator" },
            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]
      }, 
      {
        label: 'Frameless',
        submenu: [
          {
            label: "New Window",
            accelerator: "Command+N",
            click: function() {
              createWindow()
            }
          },
          {
            label: "Close",
            accelerator: "Command+W",
            click: function() {
              BrowserWindow.getFocusedWindow().close();
            }
          }
        ]
      },
      {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]
      }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));    
}

function createWindow (initUrl, frame) {

  if (typeof frame === 'undefined') {
    frame = true;
  }

  mainWindowIndex++;
  // Create the browser window.
  mainWindow[mainWindowIndex] = new BrowserWindow({
    width: 980, 
    height: 600,
    frame: frame
  })

  if (typeof initUrl === 'undefined') {
    initUrl = url.format({
      pathname: path.join(__dirname, 'app/index.html'),
      protocol: 'file:',
      slashes: true
    })
  } else {
    mainWindow[mainWindowIndex].custom = {
      url: initUrl
    };

    initUrl = url.format({
      pathname: path.join(__dirname, 'app/youtube.html'),
      protocol: 'file:',
      slashes: true
    });
  } 

  // and load the index.html of the app.
  mainWindow[mainWindowIndex].loadURL(initUrl)
  mainWindow[mainWindowIndex].on('closed', function () {
    mainWindow[mainWindowIndex] = null
  })

  if (!menuInited) {
    // Create the Application's main menu
    bindMenu();
  }
}

ipc.on('openNewYoutube', function(event, url) {
  createWindow(url, false);
});

app.on('ready', function() {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwitein') {
    app.quit();
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
})
