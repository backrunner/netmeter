// requirements
const {
    app,
    BrowserWindow,
    Tray,
    Menu,
    MenuItem,
    dialog
} = require('electron');

const electron = require('electron');

const ipc = require('electron').ipcMain;
const path = require('path');

// utils
const adapterSettings = require('./utils/AdapterUtil');
const NetMeter = require('./app/NetMeter');
const NetMeterStatic = require('./app/NetMeter').static;

// windows
let settingsWindow;
let widgetWindows = {};

// tray
let tray;

// global vars
let meters = {};
let adapters;
let currentAutoAdapter;

app.on('ready', async () => {
    // app inited
    if (await adapterSettings.has()) {
        // settings existed
        let settings = await adapterSettings.get();
        adapters = await NetMeterStatic.getAdapterNames();
        if (!adapters) {
            dialog.showMessageBoxSync({
                type: 'error',
                message: '程序无法初始化'
            });
            app.quit();
        }
        if (settings && settings.moniter) {
            for (let adapter of settings.moniter) {
                if (adapter.interface === 'auto' || adapters.includes(adapter.interface)) {
                    createWidgetWindow(adapter.interface);
                }
            }
        } else {
            // read error, use default value
            createWidgetWindow('auto');
        }
    } else {
        await adapterSettings.init();
        createWidgetWindow('auto');
    }
    // create tray
    createTray();
    // set up listener
    ipc.on('get-speed', async (sender, adapter) => {
        if (adapter === 'auto') {
            let downloadSpeed = await meters.auto.getDownloadSpeed(currentAutoAdapter);
            let uploadSpeed = await meters.auto.getUploadSpeed(currentAutoAdapter);
            widgetWindows.auto.webContents.send('update-speed', {
                download: downloadSpeed,
                upload: uploadSpeed
            });
        } else if (adapters.includes(adapter) && meters[adapter] && widgetWindows[adapter]) {
            let downloadSpeed = await meters[adapter].getDownloadSpeed(adapter);
            let uploadSpeed = await meters[adapter].getUploadSpeed(adapter);
            widgetWindows[adapter].webContents.send('update-speed', {
                download: downloadSpeed,
                upload: uploadSpeed
            });
        } else {
            // adapter isn't existed
            if (widgetWindows[adapter]) {
                widgetWindows[adapter].close();
                widgetWindows[adapter] = null;
            }
        }
    });
});

function createTray() {
    let trayIco = path.resolve(__dirname, './assets/tray.ico');
    tray = new Tray(trayIco);
    tray.setToolTip('NetMeter');
    tray.setContextMenu(buildTrayMenu('penetrate'));
}

function buildTrayMenu(mode) {
    let menu = Menu.buildFromTemplate([{
        label: '网卡设置',
        click: () => {

        }
    },
    {
        label: '退出',
        click: () => {
            app.quit();
        }
    }]);
    if (mode === 'penetrate') {
        menu.insert(0, new MenuItem({
            label: '鼠标穿透',
            click: () => {
                for (let key in widgetWindows) {
                    if (widgetWindows[key]) {
                        widgetWindows[key].setIgnoreMouseEvents(true);
                    }
                }
                tray.setContextMenu(buildTrayMenu('cancel-penetrate'));
            }
        }));
    } else if (mode === 'cancel-penetrate') {
        menu.insert(0, new MenuItem({
            label: '解除鼠标穿透',
            click: () => {
                for (let key in widgetWindows) {
                    if (widgetWindows[key]) {
                        widgetWindows[key].setIgnoreMouseEvents(false);
                    }
                }
                tray.setContextMenu(buildTrayMenu('penetrate'));
            }
        }));
    }
    return menu;
}

function checkQuit() {
    for (let key in widgetWindows) {
        if (widgetWindows[key]) {
            return;
        }
    }
    app.quit();
}

async function createWidgetWindow(adapter) {
    let widgetWindow;
    let screenWidth = electron.screen.getPrimaryDisplay().size.width;
    let screenHeight = electron.screen.getPrimaryDisplay().size.height;
    var conf = {
        x: screenWidth - 118,
        y: screenHeight - 92,
        width: 104,
        height: 42,
        resizable: true,
        minimizable: false,
        maximizable: false,
        show: false,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
        transparent: true,
        skipTaskbar: true
    };

    // hidden titlebar
    if (process.platform == 'darwin')
        conf.titleBarStyle = 'hiddenInset';
    else
        conf.frame = false;

    widgetWindow = new BrowserWindow(conf);

    // set always on top
    widgetWindow.setAlwaysOnTop(true, 'screen-saver', 0);

    // load index page

    let viewpath = path.resolve(__dirname, './views/widget.html');
    widgetWindow.loadFile(viewpath);

    // event listener

    widgetWindow.on('ready-to-show', () => {
        widgetWindow.show();
        widgetWindow.webContents.send('init-adapter', adapter);
    });

    widgetWindow.on('closed', () => {
        widgetWindow[adapter] = null;
        checkQuit();
    });

    widgetWindows[adapter] = widgetWindow;
    meters[adapter] = new NetMeter();
    if (adapter === 'auto') {
        let activeAdapter = await NetMeterStatic.getActiveAdapter();
        for (let adapter of adapters) {
            // find active adapter in adapters
            if (activeAdapter.includes(adapter.replace(/\[R\]/g, '(R)'))) {
                currentAutoAdapter = adapter;
                break;
            }
        }
        if (currentAutoAdapter) {
            if (await meters[adapter].init(currentAutoAdapter)) {
                await meters[adapter].start(currentAutoAdapter);
            }
        } else {
            // cannot find active adapter in adapters
            dialog.showMessageBoxSync({
                type: 'error',
                message: `网卡 [${adapter}] 的流量计无法初始化`
            });
            widgetWindow.close();
            widgetWindow = null;
            checkQuit();
        }
    } else {
        if (await meters[adapter].init(adapter)){
            await meters[adapter].start(adapter);
        } else {
            // init error
            dialog.showMessageBoxSync({
                type: 'error',
                message: `网卡 [${adapter}] 的流量计无法初始化`
            });
            widgetWindow.close();
            widgetWindow = null;
            checkQuit();
        }
    }
}

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

    // load index page

    let viewpath = path.resolve(__dirname, './views/settings.html');
    settingsWindow.loadFile(viewpath);

    // event listener

    settingsWindow.on('ready-to-show', () => {
        settingsWindow.show();
    });

    settingsWindow.on('closed', () => {
        settingsWindow = null;
    });
}