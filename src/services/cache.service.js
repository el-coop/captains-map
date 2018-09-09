import localForage from 'localforage';
import { LeafletMapService } from "./leaflet.service";

const caches = {
	request: localForage.createInstance({
		name: 'Captains Map',
		size: 4980736,
		storeName: 'requests',
		description: 'Cache API requests',
	}),
	map: localForage.createInstance({
		name: 'Captains Map',
		size: 4980736 * 5,
		storeName: 'tiles',
		description: 'Offline map tiles',
	})
};

class Cache {
	async get(storageName, key, defaultValue = null) {
		const storage = caches[storageName];
		try {
			const data = await storage.getItem(key);
			if (!data) {
				return defaultValue;
			}

			if (data.expiry && data.expiry < Date.now()) {
				this.forget(storageName, key);
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
			await storage.removeItem(key);
			return true;
		} catch (error) {
			return false;
		}
	}

	async store(storageName, key, value, expiry = null) {
		const storage = caches[storageName];
		if (expiry) {
			expiry = Date.now() + expiry;
		}

		try {
			await storage.setItem(key, {
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