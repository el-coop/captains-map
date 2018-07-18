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
		let zoomControl = new leaflet.Control.Zoom({position: 'bottomleft'}).addTo(this.map);

		leaflet.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="//www.openstreetmap.org/copyright">OpenStreetMap</a>',
			subdomains: ['a', 'b', 'c'],
			interactive: true,
		}).addTo(this.map);

		if (leaflet.Browser.mobile) {
			this.map.removeControl(zoomControl);
		}
	}

	addMarker(marker) {
		this.markers.push(marker);
		marker.addTo(this.map);
	}

	removeMarker(marker) {
		this.map.removeLayer(marker);
	}

	move(latLang, zoom = 18) {
		this.map.flyTo(latLang, zoom);
	}

	setView(latLang, zoom = 15) {
		this.map.setView(latLang, zoom);
	}

	goToCurrentLocation() {
		this.map.locate({
			setView: true,
			maxZoom: 12
		});
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
