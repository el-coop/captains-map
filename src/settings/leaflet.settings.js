import leaflet from 'leaflet';

import markerIcon from '@/assets/images/marker-icon-2x.png';
import shadowIcon from '@/assets/images/marker-shadow.png';
import leafletControlGeocoder from 'leaflet-control-geocoder';

let mapbox_key = process.env.VUE_APP_MAPBOX_TOKEN;

export let defaultIcon = leaflet.icon({
	iconUrl: markerIcon,
	shadowUrl: shadowIcon,
});

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

export let geocoder = function () {
	if (Math.floor(Math.random() * 2) === 1) {
		return new leaflet.Control.Geocoder.Nominatim({});
	} else {
		return new leaflet.Control.Geocoder.Bing(process.env.VUE_APP_BING_KEY);
	}
}();