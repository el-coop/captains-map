import leaflet from 'leaflet';
import './leafletCache.service'
import http from './http.service';

import { tileLayer, geocoder } from '@/settings/leaflet.settings';

export class LeafletMapService {
	constructor() {
		this.map = null;
		this.queuedActions = [];
	}

	init(el, center, zoom) {

		this.map = leaflet.map(el, {
			center,
			zoom,
			zoomControl: false
		});
		if (!leaflet.Browser.mobile) {
			new leaflet.Control.Zoom({position: 'bottomleft'}).addTo(this.map);
		}
		leaflet.tileLayer.offline(tileLayer.url, tileLayer.options).addTo(this.map);

		this.runQueuedActions();
	}

	runQueuedActions() {
		let action;
		while (action = this.queuedActions.pop()) {
			this[action[0]](...action[1]);
		}
	}

	addMarker(marker) {
		if (this.map) {
			marker.addTo(this.map);
		} else {
			this.queuedActions.push(['addMarker', [marker]]);
		}
	}

	removeMarker(marker) {
		if (this.map) {
			this.map.removeLayer(marker);
		} else {
			this.queuedActions.push(['removeMarker', [marker]]);
		}
	}

	move(latLng, zoom = 18) {
		if (this.map) {
			this.map.flyTo(latLng, zoom);
		} else {
			this.queuedActions.push(['move', [latLng, zoom]]);
		}
	}

	setView(latLng, zoom = 15) {
		if (this.map) {
			this.map.setView(latLng, zoom);
		} else {
			this.queuedActions.push(['setView', [latLng, zoom]]);
		}
	}

	goToCurrentLocation() {
		if (this.map) {
			this.map.locate({
				setView: true,
				maxZoom: 17
			});
		} else {
			this.queuedActions.push(['goToCurrentLocation', []]);
		}
	}

	watchLocation(callback) {
		if (this.map) {
			this.map.locate({
				watch: true,
				enableHighAccuracy: true
			});
			this.on("locationfound", callback);
		} else {
			this.queuedActions.push(['watchLocation', [callback]]);
		}
	}

	on(event, callback) {
		if (this.map) {
			this.map.on(event, callback);
		} else {
			this.queuedActions.push(['on', [event,callback]]);
		}
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
