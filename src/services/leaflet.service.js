import leaflet from 'leaflet';
import leafletControlGeocoder from 'leaflet-control-geocoder';

import * as seetings from '@/settings/leaflet.settings';

export class LeafletMapService {
	constructor() {
		this.map = null;
		this.markers = [];
	}

	init(el, center, zoom) {

		this.map = leaflet.map(el, {
			center,
			zoom,
			zoomControl: false
		});
		new leaflet.Control.Zoom({position: 'bottomleft'}).addTo(this.map);

		if (!center) {
			this.map.locate({
				setView: true,
				maxZoom: 12
			});
		}

		leaflet.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="//www.openstreetmap.org/copyright">OpenStreetMap</a>',
			subdomains: ['a', 'b', 'c'],
			interactive: true,
		}).addTo(this.map);
	}

	async addMarker(marker) {
		this.markers.push(marker);
		marker.addTo(this.map);
	}

	move(latLang, zoom = 18) {
		this.map.flyTo(latLang, zoom);
	}

	static locate(address) {
		return new Promise((resolve, reject) => {
			LeafletMapService.geocoder.geocode(address, (result) => {
				resolve(result);
			});
		});
	}
}

LeafletMapService.geocoder = new leaflet.Control.Geocoder.Nominatim({});

export default new LeafletMapService();
