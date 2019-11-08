import localForage from 'localforage';

const caches = {
	request: localForage.createInstance({
		name: 'Captains Map',
		size: 4980736,
		storeName: 'requests',
		description: 'Cache API requests',
	}),
	settings: localForage.createInstance({
		name: 'Captains Map',
		size: 4980736 * (1 / 4),
		storeName: 'settings',
		description: 'Save user settings for consistent app feel',
	}),
	map: localForage.createInstance({
		name: 'Captains Map',
		size: 4980736 * 5,
		storeName: 'tiles',
		description: 'Offline map tiles',
	}),
	uploads: localForage.createInstance({
		name: 'Captains Map',
		size: 4980736 * 5,
		storeName: 'uploads',
		description: 'Uploads storage while waiting for success'
	})
};

class Cache {
	caches() {
		return caches;
	}

	async get(storageName, key, defaultValue = null) {
		const storage = caches[storageName];
		try {
			const data = await storage.getItem('' + key);
			if (!data) {
				return defaultValue;
			}

			if (data.expiry && parseInt(data.expiry) < Date.now()) {
				this.forget(storageName, '' + key);
				return defaultValue;
			}

			return data.value;
		} catch (error) {
			return defaultValue;
		}
	}

	async forget(storageName, key) {
		try {
			const storage = caches[storageName];
			await storage.removeItem('' + key);
			return true;
		} catch (error) {
			return false;
		}
	}

	async clear(storageName) {
		try {
			await caches[storageName].clear();
			return true;
		} catch (error) {
			return false;
		}
	}

	async store(storageName, key, value, expiry = null) {
		const storage = caches[storageName];
		if (expiry) {
			expiry = Date.now() + parseInt(expiry);
		}

		try {
			await storage.setItem('' + key, {
				value,
				expiry
			});
			return true;
		} catch (error) {
			return false;
		}
	}
}

export default new Cache();
