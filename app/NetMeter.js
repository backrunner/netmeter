const edge = require('electron-edge-js');
const path = require('path');
const dllPath = path.join(__dirname, '../lib/NetMeter.dll').replace(/\\/g, '\\\\');

const NetMeter = {
    getAdapterNames: edge.func({
        assemblyFile: dllPath,
        typeName: 'NetMeter.NetMeter',
        methodName: 'GetAdapterNames',
    }),
    init: edge.func({
        assemblyFile: dllPath,
        typeName: 'NetMeter.NetMeter',
        methodName: 'Init',
    }),
    start: edge.func({
        assemblyFile: dllPath,
        typeName: 'NetMeter.NetMeter',
        methodName: 'Start',
    }),
    getDownloadSpeed: edge.func({
        assemblyFile: dllPath,
        typeName: 'NetMeter.NetMeter',
        methodName: 'GetDownloadSpeed',
    }),
};

module.exports = NetMeter;