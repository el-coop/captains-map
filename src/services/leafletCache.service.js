import leaflet from 'leaflet';
import localForage from 'localforage';

localForage.config({
	name: 'leaflet_offline',
	version: 1.0,
	size: 4980736 * 4,
	storeName: 'tiles',
	description: 'the tiles',
});

const TileLayerOffline = leaflet.TileLayer.extend({

	createTile(coords, done) {
		const tile = leaflet.TileLayer.prototype.createTile.call(this, coords, done);
		this.getSrc(tile, coords);
		return tile;
	},

	async getSrc(tile, coords) {
		const key = this.getTileKey(coords);
		try {
			const data = await localForage.getItem(key);
			if (data && typeof data === 'object' && Date.now() < data.timestamp + 7 * 24 * 3600 * 1000) {
				tile.src = data.dataUrl;
				return;
			}
		} catch (error) {

		}

		this.cacheSrc(key, tile);
	},

	getTileKey(coords) {
		return `x${coords.x}yx${coords.y}zx${coords.x}`;
	},

	cacheSrc(key, tile) {
		const xhr = new XMLHttpRequest();
		xhr.open('get', tile.src);
		xhr.responseType = 'blob';
		xhr.onload = () => {
			const fr = new FileReader();

			fr.onload = async function () {
				await localForage.setItem(key, {
					dataUrl: this.result,
					timestamp: Date.now()
				});
			};

			fr.readAsDataURL(xhr.response); // async call
		};

		xhr.send();
	}
});

leaflet.tileLayer.offline = (url, options) => new TileLayerOffline(url, options);