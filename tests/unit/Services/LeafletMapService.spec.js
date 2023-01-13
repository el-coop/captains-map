import sinon from 'sinon';
import Leaflet from 'leaflet';
import {describe, it, expect, afterEach} from 'vitest';
import Map, { LeafletMapService } from '@/Services/LeafletMapService';
import Http from '@/Services/HttpService';
import { tileLayer, geocoder } from '@/Settings/leaflet.settings';

const el = {};

describe('Map Service', () => {

	afterEach(() => {
		Map.queuedActions = [];
		sinon.restore();
	});

	it('Initializes map with zoom on desktop and runs queued actions', () => {
		const mapStub = {};
		const addToMapStub = {
			addTo: sinon.spy()
		};
		const mapInitStub = sinon.stub(Leaflet, 'map').returns(mapStub);
		const zoomStub = sinon.stub(Leaflet.Control, 'Zoom').returns(addToMapStub);
		const layerStub = sinon.stub(Leaflet.tileLayer, 'offline').returns(addToMapStub);
		const queuedActionsStub = sinon.stub(Map, 'runQueuedActions');
		sinon.stub(Leaflet.Browser, 'mobile').value(false);


		Map.init(el, [0, 0], 15);

		expect(mapInitStub.calledWith(el, {
			center: [0, 0],
			zoom: 15,
			zoomControl: false
		})).toBeTruthy();
		expect(zoomStub.calledWith({position: 'bottomleft'})).toBeTruthy();
		expect(layerStub.calledWith(tileLayer.url, tileLayer.options)).toBeTruthy();
		expect(addToMapStub.addTo.alwaysCalledWith(mapStub)).toBeTruthy();
		expect(addToMapStub.addTo.calledTwice).toBeTruthy();
		expect(queuedActionsStub.calledOnce).toBeTruthy();
	});

	it('Initializes map without zoom on mobile and runs queued actions', () => {
		const mapStub = {};
		const addToMapStub = {
			addTo: sinon.spy()
		};
		const mapInitStub = sinon.stub(Leaflet, 'map').returns(mapStub);
		const zoomStub = sinon.stub(Leaflet.Control, 'Zoom').returns(addToMapStub);
		const layerStub = sinon.stub(Leaflet.tileLayer, 'offline').returns(addToMapStub);
		const queuedActionsStub = sinon.stub(Map, 'runQueuedActions');
		sinon.stub(Leaflet.Browser, 'mobile').value(true);


		Map.init(el, [0, 0], 15);

		expect(mapInitStub.calledWith(el, {
			center: [0, 0],
			zoom: 15,
			zoomControl: false
		}));
		expect(zoomStub.notCalled).toBeTruthy();
		expect(layerStub.calledWith(tileLayer.url, tileLayer.options)).toBeTruthy();
		expect(addToMapStub.addTo.calledWith(mapStub)).toBeTruthy();
		expect(addToMapStub.addTo.calledOnce).toBeTruthy();
		expect(queuedActionsStub.calledOnce).toBeTruthy();
	});


	it('Runs queued actions', () => {
		const marker = {};
		const callback = {};
		const addMarkerStub = sinon.stub(Map, 'addObject');
		const watchLocationStub = sinon.stub(Map, 'watchLocation');
		Map.queuedActions = [];
		Map.queuedActions.push(['addObject', [marker]]);
		Map.queuedActions.push(['addObject', [marker]]);
		Map.queuedActions.push(['watchLocation', [callback]]);

		Map.runQueuedActions();

		expect(addMarkerStub.calledTwice).toBeTruthy();
		expect(addMarkerStub.alwaysCalledWith(marker)).toBeTruthy();
		expect(watchLocationStub.called).toBeTruthy();
		expect(watchLocationStub.calledWith(callback)).toBeTruthy();
	});

	it('Adds object', () => {
		const marker = {
			addTo: sinon.spy()
		};
		Map.map = {};
		Map.addObject(marker);

		expect(marker.addTo.calledOnce).toBeTruthy();
		expect(marker.addTo.calledWith(Map.map)).toBeTruthy();
	});

	it('Queues add object if no map yet', () => {
		const marker = {};
		Map.map = null;
		Map.addObject(marker);
		expect(Map.queuedActions.length === 1).toBeTruthy();
		expect(Map.queuedActions).toEqual([['addObject', [marker]]]);
		Map.queuedActions = [];
	});


	it('Removes object', () => {
		const marker = {};
		Map.map = {
			removeLayer: sinon.spy()
		};
		Map.removeObject(marker);

		expect(Map.map.removeLayer.calledOnce).toBeTruthy();
		expect(Map.map.removeLayer.calledWith(marker)).toBeTruthy();
	});

	it('Queues remove object if no map yet', () => {
		const marker = {};
		Map.map = null;
		Map.removeObject(marker);
		expect(Map.queuedActions.length === 1).toBeTruthy();
		expect(Map.queuedActions).toEqual([['removeObject', [marker]]]);
		Map.queuedActions = [];
	});

	it('Moves view', () => {
		Map.map = {
			flyTo: sinon.spy()
		};
		Map.move([0, 0]);

		expect(Map.map.flyTo.calledOnce).toBeTruthy();
		expect(Map.map.flyTo.calledWith([0, 0])).toBeTruthy();
	});

	it('Queues move if no map yet', () => {
		Map.map = null;
		Map.move([0, 0]);
		expect(Map.queuedActions.length === 1).toBeTruthy();
		expect(Map.queuedActions).toEqual([['move', [[0, 0], 18]]]);
		Map.queuedActions = [];
	});

	it('Sets view', () => {
		Map.map = {
			setView: sinon.spy()
		};
		Map.setView([0, 0]);

		expect(Map.map.setView.calledOnce).toBeTruthy();
		expect(Map.map.setView.calledWith([0, 0])).toBeTruthy();
	});

	it('Queues setView if no map yet', () => {
		Map.map = null;
		Map.setView([0, 0]);
		expect(Map.queuedActions.length === 1).toBeTruthy();
		expect(Map.queuedActions).toEqual([['setView', [[0, 0], 15]]]);
		Map.queuedActions = [];
	});

	it('Goes to users location', () => {
		Map.map = {
			locate: sinon.spy(),
			on: sinon.spy()
		};
		Map.goToCurrentLocation();

		expect(Map.map.locate.calledOnce).toBeTruthy();
		expect(Map.map.locate.calledWith({
			watch: false,
			setView: false,
			maxZoom: 17,
			enableHighAccuracy: true
		})).toBeTruthy();
	});

	it('Goes to location that is already found', () => {
		Map.location = [0, 0];
		const setViewStub = sinon.stub(Map, 'setView');
		Map.goToCurrentLocation();

		expect(setViewStub.calledOnce).toBeTruthy();
		expect(setViewStub.calledWith([0, 0], 17)).toBeTruthy();
	});

	it('Queues goToUserLocation if no map yet', () => {
		Map.map = null;
		Map.goToCurrentLocation();
		expect(Map.queuedActions.length === 1).toBeTruthy();
		expect(Map.queuedActions).toEqual([['goToCurrentLocation', []]]);
		Map.queuedActions = [];
	});

	it('Watches location', () => {
		const callback = function () {
		};
		Map.map = {
			locate: sinon.spy(),
			on: sinon.spy()
		};
		Map.watchLocation(callback);

		expect(Map.map.locate.calledOnce).toBeTruthy();
		expect(Map.map.locate.calledWith({
			watch: true,
			setView: false,
			enableHighAccuracy: true
		})).toBeTruthy();

		expect(Map.map.on.calledTwice).toBeTruthy();
		expect(Map.map.on.calledWith('locationfound', callback)).toBeTruthy();

	});

	it('Queues watchLocation if no map yet', () => {
		const callback = function () {
		};
		Map.map = null;
		Map.watchLocation(callback);
		expect(Map.queuedActions.length === 1).toBeTruthy();
		expect(Map.queuedActions).toEqual([['watchLocation', [callback]]]);
		Map.queuedActions = [];
	});


	it('Registers event listeners', () => {
		const callback = function () {
		};
		Map.map = {
			on: sinon.spy()
		};

		Map.on('event', callback);

		expect(Map.map.on.calledOnce).toBeTruthy();
		expect(Map.map.on.calledWith('event', callback)).toBeTruthy();
	});


	it('It queues registrations of event listeners ', () => {
		const callback = function () {
		};
		Map.map = null;

		Map.on('event', callback);

		expect(Map.queuedActions.length === 1).toBeTruthy();
		expect(Map.queuedActions).toEqual([['on', ['event', callback]]]);
		Map.queuedActions = [];
	});

	it('Removes event listeners', () => {
		const callback = function () {
		};
		Map.map = {
			off: sinon.spy()
		};

		Map.off('event', callback);

		expect(Map.map.off.calledOnce).toBeTruthy();
		expect(Map.map.off.calledWith('event', callback)).toBeTruthy();
	});


	it('It queues removal of event listeners ', () => {
		const callback = function () {
		};
		Map.map = null;

		Map.off('event', callback);

		expect(Map.queuedActions.length === 1).toBeTruthy();
		expect(Map.queuedActions).toEqual([['off', ['event', callback]]]);
		Map.queuedActions = [];
	});


	it('Returns empty on address lcoation answer error', async () => {
		sinon.stub(Http, 'get').callsFake(() => {
			throw new Error('error');
		});

		const response = await LeafletMapService.locate('test');
		expect(response).toEqual([]);
	});

	it('Returns response data when address found', async () => {
		const data = [
			'test',
			'test1'
		];
		const locateStub = sinon.stub(Http, 'get').returns({
			data
		});

		const response = await LeafletMapService.locate('test', {
			_southWest: {lat: -1, lng: -1},
			_northEast: {lat: 1, lng: 1}
		});

		expect(locateStub.calledWith('geocode/test', {
			params: {
				south: -1,
				west: -1,
				north: 1,
				east: 1,
			}
		})).toBeTruthy();
		expect(response).toEqual(data);
	});

	it('Returns empty on reverse geolocation error', async () => {
		sinon.stub(Http, 'get').callsFake(() => {
			throw new Error('error');
		});

		const response = await LeafletMapService.reverseGeocode({lat: 0, lng: 0});
		expect(response).toEqual([]);
	});

	it('Returns response data when address found', async () => {
		const data = [
			'test',
		];
		sinon.stub(Http, 'get').returns({
			data
		});

		const response = await LeafletMapService.reverseGeocode({lat: 0, lng: 0});
		expect(response).toEqual(data);
	});

	it('Stops watching location', () => {
		Map.map = {
			stopLocate: sinon.spy(),
			off: sinon.spy()
		};
		Map.location = [];
		Map.stopLocate();

		expect(Map.map.stopLocate.calledOnce).toBeTruthy();
		expect(Map.map.off.calledOnce).toBeTruthy();
		expect(Map.location).toBeNull();
	});

	it('Queues stopLocate if no map yet', () => {
		Map.map = null;
		Map.stopLocate();
		expect(Map.queuedActions.length === 1).toBeTruthy();
		expect(Map.queuedActions).toEqual([['stopLocate', []]]);
		Map.queuedActions = [];
	});

	it('Returns default boundaries value when map is null', () => {
		Map.map = null;
		expect(Map.getBorders()).toEqual({
			_southWest: {
				lat: -90,
				lng: -180
			},
			_northEast: {
				lat: 90,
				lng: 180
			}
		});
	});

	it('Returns map boundries when it is set', () => {
		Map.map = {
			getBounds() {
				return 'data'
			}
		};
		expect(Map.getBorders()).toEqual('data');
	});

});
