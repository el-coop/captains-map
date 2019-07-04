import sinon from 'sinon';
import Leaflet from 'leaflet';
import { assert } from 'chai';
import Map, { LeafletMapService } from '@/Services/LeafletMapService';
import Http from '@/Services/HttpService';
import { tileLayer, geocoder } from '@/Settings/leaflet.settings';

const el = {};

describe('Map Service', () => {

	afterEach(() => {
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

		assert.isTrue(mapInitStub.calledWith(el, {
			center: [0, 0],
			zoom: 15,
			zoomControl: false
		}));
		assert.isTrue(zoomStub.calledWith({position: 'bottomleft'}));
		assert.isTrue(layerStub.calledWith(tileLayer.url, tileLayer.options));
		assert.isTrue(addToMapStub.addTo.alwaysCalledWith(mapStub));
		assert.isTrue(addToMapStub.addTo.calledTwice);
		assert.isTrue(queuedActionsStub.calledOnce);
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

		assert.isTrue(mapInitStub.calledWith(el, {
			center: [0, 0],
			zoom: 15,
			zoomControl: false
		}));
		assert.isTrue(zoomStub.notCalled);
		assert.isTrue(layerStub.calledWith(tileLayer.url, tileLayer.options));
		assert.isTrue(addToMapStub.addTo.calledWith(mapStub));
		assert.isTrue(addToMapStub.addTo.calledOnce);
		assert.isTrue(queuedActionsStub.calledOnce);
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

		assert.isTrue(addMarkerStub.calledTwice);
		assert.isTrue(addMarkerStub.alwaysCalledWith(marker));
		assert.isTrue(watchLocationStub.called);
		assert.isTrue(watchLocationStub.calledWith(callback));
	});

	it('Adds object', () => {
		const marker = {
			addTo: sinon.spy()
		};
		Map.map = {};
		Map.addObject(marker);

		assert.isTrue(marker.addTo.calledOnce);
		assert.isTrue(marker.addTo.calledWith(Map.map));
	});

	it('Queues add object if no map yet', () => {
		const marker = {};
		Map.map = null;
		Map.addObject(marker);
		assert.isTrue(Map.queuedActions.length === 1);
		assert.deepEqual(Map.queuedActions, [['addObject', [marker]]]);
		Map.queuedActions = [];
	});


	it('Removes object', () => {
		const marker = {};
		Map.map = {
			removeLayer: sinon.spy()
		};
		Map.removeObject(marker);

		assert.isTrue(Map.map.removeLayer.calledOnce);
		assert.isTrue(Map.map.removeLayer.calledWith(marker));
	});

	it('Queues remove object if no map yet', () => {
		const marker = {};
		Map.map = null;
		Map.removeObject(marker);
		assert.isTrue(Map.queuedActions.length === 1);
		assert.deepEqual(Map.queuedActions, [['removeObject', [marker]]]);
		Map.queuedActions = [];
	});

	it('Moves view', () => {
		Map.map = {
			flyTo: sinon.spy()
		};
		Map.move([0, 0]);

		assert.isTrue(Map.map.flyTo.calledOnce);
		assert.isTrue(Map.map.flyTo.calledWith([0, 0]));
	});

	it('Queues move if no map yet', () => {
		Map.map = null;
		Map.move([0, 0]);
		assert.isTrue(Map.queuedActions.length === 1);
		assert.deepEqual(Map.queuedActions, [['move', [[0, 0], 18]]]);
		Map.queuedActions = [];
	});

	it('Sets view', () => {
		Map.map = {
			setView: sinon.spy()
		};
		Map.setView([0, 0]);

		assert.isTrue(Map.map.setView.calledOnce);
		assert.isTrue(Map.map.setView.calledWith([0, 0]));
	});

	it('Queues setView if no map yet', () => {
		Map.map = null;
		Map.setView([0, 0]);
		assert.isTrue(Map.queuedActions.length === 1);
		assert.deepEqual(Map.queuedActions, [['setView', [[0, 0], 15]]]);
		Map.queuedActions = [];
	});

	it('Goes to users location', () => {
		Map.map = {
			locate: sinon.spy(),
			on: sinon.spy()
		};
		Map.goToCurrentLocation();

		assert.isTrue(Map.map.locate.calledOnce);
		assert.isTrue(Map.map.locate.calledWith({
			watch: false,
			setView: false,
			maxZoom: 17,
			enableHighAccuracy: true
		}));
	});

	it('Goes to location that is already found', () => {
		Map.location = [0, 0];
		const setViewStub = sinon.stub(Map, 'setView');
		Map.goToCurrentLocation();

		assert.isTrue(setViewStub.calledOnce);
		assert.isTrue(setViewStub.calledWith([0, 0], 17));
	});

	it('Queues goToUserLocation if no map yet', () => {
		Map.map = null;
		Map.goToCurrentLocation();
		assert.isTrue(Map.queuedActions.length === 1);
		assert.deepEqual(Map.queuedActions, [['goToCurrentLocation', []]]);
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

		assert.isTrue(Map.map.locate.calledOnce);
		assert.isTrue(Map.map.locate.calledWith({
			watch: true,
			setView: false,
			enableHighAccuracy: true
		}));

		assert.isTrue(Map.map.on.calledTwice);
		assert.isTrue(Map.map.on.calledWith('locationfound', callback));

	});

	it('Queues watchLocation if no map yet', () => {
		const callback = function () {
		};
		Map.map = null;
		Map.watchLocation(callback);
		assert.isTrue(Map.queuedActions.length === 1);
		assert.deepEqual(Map.queuedActions, [['watchLocation', [callback]]]);
		Map.queuedActions = [];
	});


	it('Registers event listeners', () => {
		const callback = function () {
		};
		Map.map = {
			on: sinon.spy()
		};

		Map.on('event', callback);

		assert.isTrue(Map.map.on.calledOnce);
		assert.isTrue(Map.map.on.calledWith('event', callback));
	});


	it('It queues registrations of event listeners ', () => {
		const callback = function () {
		};
		Map.map = null;

		Map.on('event', callback);

		assert.isTrue(Map.queuedActions.length === 1);
		assert.deepEqual(Map.queuedActions, [['on', ['event', callback]]]);
		Map.queuedActions = [];
	});

	it('Removes event listeners', () => {
		const callback = function () {
		};
		Map.map = {
			off: sinon.spy()
		};

		Map.off('event', callback);

		assert.isTrue(Map.map.off.calledOnce);
		assert.isTrue(Map.map.off.calledWith('event', callback));
	});


	it('It queues removal of event listeners ', () => {
		const callback = function () {
		};
		Map.map = null;

		Map.off('event', callback);

		assert.isTrue(Map.queuedActions.length === 1);
		assert.deepEqual(Map.queuedActions, [['off', ['event', callback]]]);
		Map.queuedActions = [];
	});


	it('Returns empty on address lcoation answer error', async () => {
		sinon.stub(Http, 'get').callsFake(() => {
			throw new Error('error');
		});

		const response = await LeafletMapService.locate('test');
		assert.deepEqual(response, []);
	});

	it('Returns response data when address found', async () => {
		const data = [
			'test',
			'test1'
		];
		sinon.stub(Http, 'get').returns({
			data
		});

		const response = await LeafletMapService.locate('test');
		assert.deepEqual(response, data);
	});

	it('Returns empty on reverse geolocation error', async () => {
		sinon.stub(Http, 'get').callsFake(() => {
			throw new Error('error');
		});

		const response = await LeafletMapService.reverseGeocode({lat: 0, lng: 0});
		assert.deepEqual(response, []);
	});

	it('Returns response data when address found', async () => {
		const data = [
			'test',
		];
		sinon.stub(Http, 'get').returns({
			data
		});

		const response = await LeafletMapService.reverseGeocode({lat: 0, lng: 0});
		assert.deepEqual(response, data);
	});

	it('Stops watching location', () => {
		Map.map = {
			stopLocate: sinon.spy(),
			off: sinon.spy()
		};
		Map.location = [];
		Map.stopLocate();

		assert.isTrue(Map.map.stopLocate.calledOnce);
		assert.isTrue(Map.map.off.calledOnce);
		assert.isNull(Map.location);
	});

	it('Queues stopLocate if no map yet', () => {
		Map.map = null;
		Map.stopLocate();
		assert.isTrue(Map.queuedActions.length === 1);
		assert.deepEqual(Map.queuedActions, [['stopLocate', []]]);
		Map.queuedActions = [];
	});

	it('Returns default boundaries value when map is null', () => {
		Map.map = null;
		assert.deepEqual(Map.getBorders(), {
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
		assert.deepEqual(Map.getBorders(), 'data');
	});

});
