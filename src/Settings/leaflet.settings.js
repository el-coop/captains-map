const mapbox_key = import.meta.env.VITE_APP_MAPBOX_TOKEN;

export const mapboxLayer = {
	url: `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapbox_key}`,
	options: {
		tileSize: 512,
		zoomOffset: -1,
		id: 'mapbox/streets-v11',
	}
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
