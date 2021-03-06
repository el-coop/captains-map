import leaflet from 'leaflet';
import '@/Services/LeafletCacheService'
import http from '@/Services/HttpService';
import 'leaflet.markercluster/dist/MarkerCluster.css';

import { tileLayer } from '@/Settings/leaflet.settings';

export class LeafletMapService {
	constructor() {
		this.map = null;
		this.queuedActions = [];
		this.location = null;
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

	getBorders() {
		if (this.map) {
			return this.map.getBounds();
		}

		return {
			_southWest: {
				lat: -90,
				lng: -180
			},
			_northEast: {
				lat: 90,
				lng: 180
			}
		}
	}

	runQueuedActions() {
		let action;
		while (action = this.queuedActions.pop()) {
			this[action[0]](...action[1]);
		}
	}

	addObject(marker) {
		if (this.map) {
			marker.addTo(this.map);
		} else {
			this.queuedActions.push(['addObject', [marker]]);
		}
	}

	removeObject(marker) {
		if (this.map) {
			this.map.removeLayer(marker);
		} else {
			this.queuedActions.push(['removeObject', [marker]]);
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
			if (!this.location) {
				const goToLocation = (location) => {
					this.map.off('locationfound', goToLocation);
					this.setView(location.latlng, 17)
				};
				this.map.locate({
					watch: false,
					setView: false,
					maxZoom: 17,
					enableHighAccuracy: true
				});
				this.map.on("locationfound", goToLocation);
			} else {
				this.setView(this.location, 17)
			}
		} else {
			this.queuedActions.push(['goToCurrentLocation', []]);
		}
	}

	watchLocation(callback) {
		if (this.map) {
			this.map.locate({
				watch: true,
				setView: false,
				enableHighAccuracy: true
			});
			this.on("locationfound", callback);
			this.on("locationfound", (location) => {
				this.location = location.latlng;
			});
		} else {
			this.queuedActions.push(['watchLocation', [callback]]);
		}
	}

	stopLocate() {
		if (this.map) {
			this.map.stopLocate();
			this.map.off("locationfound");
			this.location = null;
		} else {
			this.queuedActions.push(['stopLocate', []]);
		}
	}

	on(event, callback) {
		if (this.map) {
			this.map.on(event, callback);
		} else {
			this.queuedActions.push(['on', [event, callback]]);
		}
	}

	off(event, callback) {
		if (this.map) {
			this.map.off(event, callback);
		} else {
			this.queuedActions.push(['off', [event, callback]]);
		}
	}

	getCurrentLocation() {
		return this.map.getBounds();
	}

	static async locate(address, currentLocation) {
		let response;
		try {
			response = await http.get(`geocode/${address}`, {
				params: {
					south: currentLocation._southWest.lat,
					west: currentLocation._southWest.lng,
					north: currentLocation._northEast.lat,
					east: currentLocation._northEast.lng,
				}
			});
		} catch (error) {

		}
		if (!response || response.status < 200 || response.status > 299) {
			return [];
		}
		return response.data;
	}

	static async reverseGeocode(coords) {
		let response;
		try {
			response = await http.get(`geocode/${coords.lat}/${coords.lng}`);
		} catch (error) {

		}
		if (!response || response.status < 200 || response.status > 299) {
			return [];
		}
		return response.data;
	}
}

export default new LeafletMapService();
