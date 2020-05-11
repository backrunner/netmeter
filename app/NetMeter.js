const edge = require('electron-edge-js');
const path = require('path');
const DLL_PATH = path.join(__dirname, '../lib/NetMeter.dll').replace(/\\/g, '\\\\');
const TYPE_NAME = 'NetMeter.NetMeter';

const NetMeterDLLStatic = {
    getAdapterNames: edge.func({
        assemblyFile: DLL_PATH,
        typeName: TYPE_NAME,
        methodName: 'GetAdapterNames',
    }),
    getActiveAdapter: edge.func({
        assemblyFile: DLL_PATH,
        typeName: TYPE_NAME,
        methodName: 'GetActivatedAdapter',
    }),
    getAdapterNamesPromise() {
        return new Promise((resolve, reject) => {
            this.getAdapterNames(null, (err, res) => {
                if (err) {
                    console.error(err);
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
    getActiveAdapterPromise() {
        return new Promise((resolve, reject) => {
            this.getActiveAdapter(null, (err, res) => {
                if (err) {
                    console.error(err);
                    resolve(null);
                    return;
                }
                resolve(res);
            });
        });
    },
};

class NetMeterDLL {
    constructor() {
        this.init = edge.func({
            assemblyFile: DLL_PATH,
            typeName: TYPE_NAME,
            methodName: 'Init',
        });
        this.remove = edge.func({
            assemblyFile: DLL_PATH,
            typeName: TYPE_NAME,
            methodName: 'Remove',
        });
        this.start = edge.func({
            assemblyFile: DLL_PATH,
            typeName: TYPE_NAME,
            methodName: 'Start',
        });
        this.stop = edge.func({
            assemblyFile: DLL_PATH,
            typeName: TYPE_NAME,
            methodName: 'Stop',
        });
        this.getDownloadSpeed = edge.func({
            assemblyFile: DLL_PATH,
            typeName: TYPE_NAME,
            methodName: 'GetDownloadSpeed',
        });
        this.getUploadSpeed = edge.func({
            assemblyFile: DLL_PATH,
            typeName: TYPE_NAME,
            methodName: 'GetUploadSpeed',
        });
        // Promise
        this.initPromise = name => {
            return new Promise((resolve, reject) => {
                this.init(name, (err, res) => {
                    if (err) {
                        console.error(err);
                        resolve(false);
                        return;
                    }
                    resolve(true);
                });
            });
        };
        this.removePromise = name => {
            return new Promise((resolve, reject) => {
                this.remove(name, (err, res) => {
                    if (err) {
                        console.error(err);
                        resolve(false);
                        return;
                    }
                    resolve(true);
                });
            });
        };
        this.startPromise = name => {
            return new Promise((resolve, reject) => {
                this.start(name, (err, res) => {
                    if (err) {
                        console.error(err);
                        resolve(false);
                        return;
                    }
                    resolve(true);
                });
            });
        };
        this.stopPromise = name => {
            return new Promise((resolve, reject) => {
                this.stop(name, (err, res) => {
                    if (err) {
                        console.error(err);
                        resolve(false);
                        return;
                    }
                    resolve(true);
                });
            });
        };
        this.getDownloadSpeedPromise = name => {
            return new Promise((resolve, reject) => {
                this.getDownloadSpeed(name, (err, res) => {
                    if (err) {
                        console.error(err);
                        resolve(null);
                        return;
                    }
                    resolve(res);
                });
            });
        };
        this.getUploadSpeedPromise = name => {
            return new Promise((resolve, reject) => {
                this.getUploadSpeed(name, (err, res) => {
                    if (err) {
                        console.error(err);
                        resolve(null);
                        return;
                    }
                    resolve(res);
                });
            });
        };
    }
}

class NetMeter {
    constructor() {
        this.DLL = new NetMeterDLL();
        this.init = async name => {
            return await this.DLL.initPromise(name);
        };
        this.remove = async name => {
            return await this.DLL.removePromise(name);
        }
        this.start = async name => {
            return await this.DLL.startPromise(name);
        };
        this.stop = async name => {
            return await this.DLL.stopPromise(name);
        };
        this.getDownloadSpeed = async name => {
            return await this.DLL.getDownloadSpeedPromise(name);
        };
        this.getUploadSpeed = async name => {
            return await this.DLL.getUploadSpeedPromise(name);
        };
    }
}

const NetMeterStatic = {
    async getAdapterNames() {
        return await NetMeterDLLStatic.getAdapterNamesPromise();
    },
    async getActiveAdapter() {
        return await NetMeterDLLStatic.getActiveAdapterPromise();
    }
};

module.exports = NetMeter;
module.exports.static = NetMeterStatic;
