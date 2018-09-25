let mapbox_key = process.env.VUE_APP_MAPBOX_TOKEN;

export let mapboxLayer = {
	url: `https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=${mapbox_key}`,
	options: {
		attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}
};

export let openstreetmapLayer = {
	url: '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	options: {
		attribution: '&copy; <a href="//www.openstreetmap.org/copyright">OpenStreetMap</a>',
		subdomains: ['a', 'b', 'c'],
		interactive: true,
	}
};

const layers = [mapboxLayer, openstreetmapLayer];
export let tileLayer = layers[Math.floor(Math.random() * layers.length)];
