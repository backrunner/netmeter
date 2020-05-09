const storage = require('electron-json-storage');

const StorageUtil = {
    async has(key) {
        try {
            return await this.hasPromise(key);
        } catch (err) {
            console.error(err);
            return false;
        }
    },
    async set(key, object) {
        try {
            return await this.setPromise(key, object);
        } catch (err) {
            console.error(err);
            return false;
        }
    },
    async get(key) {
        try {
            return await this.getPromise(key);
        } catch (err) {
            console.error(err);
            return false;
        }
    },
    hasPromise(key) {
        return new Promise((resolve, reject) => {
            storage.has(key, (err, hasKey) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(hasKey);
            });
        });
    },
    getPromise(key) {
        return new Promise((resolve, reject) => {
            storage.get(key, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (typeof data == 'undefined' || data == null) {
                    resolve(null);
                    return;
                }
                resolve(data);
            });
        });
    },
    setPromise(key, object) {
        return new Promise((resolve, reject) => {
            storage.set(key, object, err => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }
};

module.exports = StorageUtil;