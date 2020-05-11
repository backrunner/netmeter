const storage = require('./StorageUtil');

const AdapterUtil = {
    async init() {
        const adapter = {
            moniter: [
                {
                    interface: 'auto'
                }
            ]
        };
        return await storage.set('adapter', adapter);
    },
    async has() {
        return await storage.has('adapter');
    },
    async get() {
        return await storage.get('adapter');
    }
};

module.exports = AdapterUtil;