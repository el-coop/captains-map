import leaflet from 'leaflet';
import Cache from './Cache';

const TileLayerOffline = leaflet.TileLayer.extend({

	createTile(coords, done) {
		const tile = leaflet.TileLayer.prototype.createTile.call(this, coords, done);
		this.getSrc(tile, coords);
		return tile;
	},

	async getSrc(tile, coords) {
		const key = this.getTileKey(coords);
		// try {
		// 	const data = await Cache.get('map', key);
		// 	if (data) {
		// 		return tile.src = data;
		// 	}
		// } catch (error) {
		//
		// }

		this.cacheSrc(key, tile);
	},

	getTileKey(coords) {
		return `x${coords.x}y${coords.y}z${coords.z}`;
	},

	async cacheSrc(key, tile) {
		if (typeof FileReader === "undefined") {
			return;
		}

		const tileUrl = tile.src;
		tile.src = '';

		try {
			const response = await fetch(tileUrl);
			const result = await response.blob();
			const fr = new FileReader();

			fr.onload = async function () {
				tile.src = this.result;
				Cache.store('map', key, this.result, 604800);
			};

			fr.readAsDataURL(result);
		} catch (e) {
			tile.src = tileUrl;
		}

	}
});

leaflet.tileLayer.offline = (url, options) => new TileLayerOffline(url, options);
