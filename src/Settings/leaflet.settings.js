const mapbox_key = process.env.VUE_APP_MAPBOX_TOKEN;

export const mapboxLayer = {
	url: `https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=${mapbox_key}`,
	options: {}
};

export const openstreetmapLayer = {
	url: '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	options: {
		subdomains: ['a', 'b', 'c'],
		interactive: true,
	}
};

const layers = [mapboxLayer, openstreetmapLayer];
export const tileLayer = layers[Math.floor(Math.random() * layers.length)];
