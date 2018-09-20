import sinon from 'sinon';
import Leaflet from 'leaflet';
import { assert } from 'chai';
import Map, { LeafletMapService } from '@/services/leaflet.service';
import Http from '@/services/http.service';
import { tileLayer, geocoder } from '@/settings/leaflet.settings';

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
		const addMarkerStub = sinon.stub(Map, 'addMarker');
		const watchLocationStub = sinon.stub(Map, 'watchLocation');
		Map.queuedActions.push(['addMarker', [marker]]);
		Map.queuedActions.push(['addMarker', [marker]]);
		Map.queuedActions.push(['watchLocation', [callback]]);

		Map.runQueuedActions();

		assert.isTrue(addMarkerStub.calledTwice);
		assert.isTrue(addMarkerStub.alwaysCalledWith(marker));
		assert.isTrue(watchLocationStub.called);
		assert.isTrue(watchLocationStub.calledWith(callback));
	});

	it('Adds marker', () => {
		const marker = {
			addTo: sinon.spy()
		};
		Map.map = {};
		Map.addMarker(marker);

		assert.isTrue(marker.addTo.calledOnce);
		assert.isTrue(marker.addTo.calledWith(Map.map));
	});

	it('Queues add marker if no map yet', () => {
		const marker = {};
		Map.map = null;
		Map.addMarker(marker);
		assert.isTrue(Map.queuedActions.length === 1);
		assert.deepEqual(Map.queuedActions, [['addMarker', [marker]]]);
		Map.queuedActions = [];
	});


	it('Removes marker', () => {
		const marker = {};
		Map.map = {
			removeLayer: sinon.spy()
		};
		Map.removeMarker(marker);

		assert.isTrue(Map.map.removeLayer.calledOnce);
		assert.isTrue(Map.map.removeLayer.calledWith(marker));
	});

	it('Queues remove marker if no map yet', () => {
		const marker = {};
		Map.map = null;
		Map.removeMarker(marker);
		assert.isTrue(Map.queuedActions.length === 1);
		assert.deepEqual(Map.queuedActions, [['removeMarker', [marker]]]);
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
			locate: sinon.spy()
		};
		Map.goToCurrentLocation();

		assert.isTrue(Map.map.locate.calledOnce);
		assert.isTrue(Map.map.locate.calledWith({
			setView: true,
			maxZoom: 17
		}));
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
			enableHighAccuracy: true
		}));

		assert.isTrue(Map.map.on.calledOnce);
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

	it('Returns empty on address lcoation answer error', async () => {
		sinon.stub(Http, 'get').callsFake(() => {
			throw new Error('error');
		});

		const response = await LeafletMapService.locate('test');
		assert.deepEqual(response, []);
	});

	it('Returns response data when address found', async () => {
		const data =[
			'test',
			'test1'
		];
		sinon.stub(Http, 'get').returns({
			data
		});

		const response = await LeafletMapService.locate('test');
		assert.deepEqual(response, data);
	});
});