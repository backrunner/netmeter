const edge = require('electron-edge-js');
const path = require('path');
const DLL_PATH = path.join(__dirname, '../lib/NetMeter.dll').replace(/\\/g, '\\\\');
const TYPE_NAME = 'NetMeter.NetMeter';

const NetMeterDLL = {
    getAdapterNames: edge.func({
        assemblyFile: DLL_PATH,
        typeName: TYPE_NAME,
        methodName: 'GetAdapterNames',
    }),
    init: edge.func({
        assemblyFile: DLL_PATH,
        typeName: TYPE_NAME,
        methodName: 'Init',
    }),
    start: edge.func({
        assemblyFile: DLL_PATH,
        typeName: TYPE_NAME,
        methodName: 'Start',
    }),
    stop: edge.func({
        assemblyFile: DLL_PATH,
        typeName: TYPE_NAME,
        methodName: 'Stop',
    }),
    getDownloadSpeed: edge.func({
        assemblyFile: DLL_PATH,
        typeName: TYPE_NAME,
        methodName: 'GetDownloadSpeed',
    }),
    getUploadSpeed: edge.func({
        assemblyFile: DLL_PATH,
        typeName: TYPE_NAME,
        methodName: 'GetUploadSpeed',
    }),
    getAdapterNamesPromise() {
        return new Promise((resolve, reject) => {
            this.getAdapterNames(null, (err, res) => {
                if (err) {
                    resolve(null);
                    return;
                }
                try {
                    resolve(JSON.parse(res));
                } catch (e) {
                    resolve(null);
                }
             });
        });
    },
    initPromise(name) {
        return new Promise((resolve, reject) => {
            this.init(name, (err, res) => {
                if (err) {
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    },
    startPromise() {
        return new Promise((resolve, reject) => {
            this.start(null, (err, res) => {
                if (err) {
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    },
    stopPromise() {
        return new Promise((resolve, reject) => {
            this.stop(null, (err, res) => {
                if (err) {
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    },
    getDownloadSpeedPromise() {
        return new Promise((resolve, reject) => {
            this.getDownloadSpeed(null, (err, res) => {
                if (err) {
                    resolve(null);
                    return;
                }
                resolve(res);
            });
        });
    },
    getUploadSpeedPromise() {
        return new Promise((resolve, reject) => {
            this.getUploadSpeed(null, (err, res) => {
                if (err) {
                    resolve(null);
                    return;
                }
                resolve(res);
            });
        });
    }
};

const NetMeter = {
    async getAdapterNames() {
        return await NetMeterDLL.getAdapterNamesPromise();
    },
    async init(name) {
        return await NetMeterDLL.initPromise(name);
    },
    async start() {
        return await NetMeterDLL.startPromise();
    },
    async stop() {
        return await NetMeterDLL.stopPromise();
    },
    async getDownloadSpeed() {
        return await NetMeterDLL.getDownloadSpeedPromise();
    },
    async getUploadSpeed() {
        return await NetMeterDLL.getUploadSpeedPromise();
    }
};

module.exports = NetMeter;