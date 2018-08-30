import leaflet from 'leaflet';
import http from './http.service';

import { tileLayer, geocoder } from '@/settings/leaflet.settings';

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

		leaflet.tileLayer(tileLayer.url, tileLayer.options).addTo(this.map);

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

	static async locate(address) {
		let response = {
			data: []
		};
		try {
			response = await http.get(`geocode/${address}`);
		} catch (error) {
		}
		return response.data;
	}
}

export default new LeafletMapService();
