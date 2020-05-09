const storage = require('./StorageUtil');

const AdapterUtil = {
    init() {
        const adapter = {
            moniter: [
                {
                    interface: 'auto'
                }
            ]
        };
        return storage.set('adapter', adapter);
    },
    has() {
        return storage.has('adapter');
    },
    get() {
        return storage.get('adapter');
    }
};

module.exports = AdapterUtil;