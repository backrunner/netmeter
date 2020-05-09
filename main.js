// requirements
const {
    app,
    BrowserWindow
} = require('electron');

const ipc = require('electron').ipcMain;
const path = require('path');

// utils
const adapterSettings = require('./utils/AdapterUtil');

let settingsWindow;
let widgetWindows = [];

app.on('ready', () => {
    // app inited
    if (adapterSettings.has()) {
        // settings existed
        let settings = adapterSettings.get();
        if (settings !== null && settings.moniter !== null) {
            for (let adapter of settings.moniter) {
                createWidgetWindow(adapter.inteface);
            }
        } else {
            // read error, use default value
            createWidgetWindow('auto');
        }
    } else {
        adapterSettings.init();
    }
});

function createSettingsWindow() {
    // conf of main window
    var conf = {
        width: 640,
        height: 360,
        resizable: false,
        maximizable: false,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    };

    // titlebar
    if (process.platform == 'darwin')
        conf.titleBarStyle = 'hiddenInset';
    else
        conf.frame = false;

    settingsWindow = new BrowserWindow(conf);

    //load index page

    let viewpath = path.resolve(__dirname, './views/settings.html');
    settingsWindow.loadFile(viewpath);

    //event listener

    settingsWindow.on('ready-to-show', () => {
        settingsWindow.show();
    });

    settingsWindow.on('closed', () => {
        app.quit();
    });
}

function createWidgetWindow(adapter) {
    let widgetWindow;

    var conf = {
        width: 640,
        height: 360,
        resizable: false,
        maximizable: false,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    };

    // titlebar
    if (process.platform == 'darwin')
        conf.titleBarStyle = 'hiddenInset';
    else
        conf.frame = false;

    widgetWindow = new BrowserWindow(conf);

    //load index page

    let viewpath = path.resolve(__dirname, './views/widget.html');
    widgetWindow.loadFile(viewpath);

    //event listener

    widgetWindow.on('ready-to-show', () => {
        widgetWindow.show();
        ipc.on('app-quitNow', ()=>{
            app.quit();
        });
    });

    widgetWindows.push(widgetWindow);
}