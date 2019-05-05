import Vue from 'vue';
import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import MapUserMarker from '@/Components/Map/Markers/MapUserMarker';
import leaflet from 'leaflet';
import mapService from '@/Services/LeafletMapService';
import sinon from 'sinon';

describe('MapUserMarker.vue', () => {

	let mocks;
	let mapObject;
	let parent;
	let divIcon

	beforeEach(() => {
		mocks = {
			$bus: {
				$emit: sinon.spy(),
				$on: sinon.spy(),
				$off: sinon.spy()
			},
			$toast: {
				info: sinon.spy(),
				hide: sinon.spy()
			}
		};
		parent = {
			methods: {
				addObject: sinon.spy(),
				removeObject: sinon.spy()
			}
		};
		divIcon = {
			firstChild: {
				classList: {
					add: sinon.stub(),
					remove: sinon.stub(),
				}
			}
		};
		mapObject = {
			on: sinon.stub().returnsThis(),
			setLatLng: sinon.stub(),
			getElement: sinon.stub().returns(divIcon)
		};
	});

	afterEach(() => {
		sinon.restore();
	});

	it('watches for location when created', () => {
		const addWatchLocationStub = sinon.stub(mapService, 'watchLocation');
		const wrapper = shallowMount(MapUserMarker, {
			mocks
		});

		assert.isTrue(wrapper.find('div').exists());
		assert.isTrue(addWatchLocationStub.calledOnce);
	});


	it('adds a marker when location is found and sets interval check', () => {
		global.setInterval = sinon.stub();
		const icon = sinon.spy();
		const createIconStub = sinon.stub(leaflet, 'divIcon').returns(icon);
		const createMarkerStub = sinon.stub(leaflet, 'marker').returns(mapObject);


		const wrapper = shallowMount(MapUserMarker, {
			parentComponent: parent,
			mocks
		});

		wrapper.vm.setLocation({
			accuracy: 10,
			latlng: {
				lat: 0,
				lng: 0
			},
			timestamp: Date.now()
		});

		assert.isTrue(createIconStub.calledOnce);
		assert.isTrue(createIconStub.calledWith({
			html: wrapper.vm.$el.outerHTML,
			iconSize: [20, 20]
		}));
		assert.isTrue(createMarkerStub.calledOnce);
		assert.isTrue(createMarkerStub.calledWith([0, 0], {icon}));
		assert.isTrue(mapObject.on.calledOnce);
		assert.isTrue(mapObject.on.calledWith('click'));
		assert.isTrue(parent.methods.addObject.calledOnce);
		assert.isTrue(parent.methods.addObject.calledWith(mapObject));
		assert.isTrue(mocks.$toast.info.calledOnce);
		assert.isTrue(mocks.$toast.info.calledWith('You can now go to your location by holding the location icon. (right click on desktop)', ''));
		assert.isTrue(global.setInterval.calledOnce);
		assert.isTrue(divIcon.firstChild.classList.remove.calledOnce);
		assert.isTrue(divIcon.firstChild.classList.remove.calledWith('map__user-marker--old'));
	});

	it('doesnt set interval if already set', () => {
		global.setInterval = sinon.stub();
		const icon = sinon.spy();
		sinon.stub(leaflet, 'divIcon').returns(icon);
		sinon.stub(leaflet, 'marker').returns(mapObject);


		const wrapper = shallowMount(MapUserMarker, {
			parentComponent: parent,
			mocks
		});

		wrapper.setData({
			checkOldInterval: () => {
			}
		});

		wrapper.vm.setLocation({
			accuracy: 10,
			latlng: {
				lat: 0,
				lng: 0
			},
			timestamp: Date.now()
		});

		assert.isFalse(global.setInterval.called);
	});


	it('updates location for already existent marker', () => {

		const icon = sinon.spy();
		const createIconStub = sinon.stub(leaflet, 'divIcon').returns(icon);
		const createMarkerStub = sinon.stub(leaflet, 'marker').returns(mapObject);

		const wrapper = shallowMount(MapUserMarker, {
			parentComponent: parent,
			mocks
		});

		wrapper.setData({
			mapObject
		});

		wrapper.vm.setLocation({
			accuracy: 10,
			latlng: {
				lat: 0,
				lng: 0
			},
			timestamp: Date.now()
		});

		assert.isFalse(createIconStub.called);
		assert.isFalse(createMarkerStub.called);
		assert.isFalse(parent.methods.addObject.called);
		assert.isTrue(mapObject.setLatLng.calledOnce);
		assert.isTrue(mapObject.setLatLng.calledWith({
			lat: 0,
			lng: 0
		}));
		console.log(divIcon.firstChild.classList.remove.args);
		assert.isTrue(divIcon.firstChild.classList.remove.calledOnce);
		assert.isTrue(divIcon.firstChild.classList.remove.calledWith('map__user-marker--old'));
	});

	it('renders accuracy marker', () => {
		const wrapper = shallowMount(MapUserMarker, {
			parentComponent: parent,
			mocks
		});

		wrapper.setData({
			mapObject
		});

		wrapper.vm.setLocation({
			accuracy: 51,
			latlng: {
				lat: 0,
				lng: 0
			},
			timestamp: Date.now()
		});

		wrapper.vm.checkIfOld();

		assert.isTrue(wrapper.find('mapuseraccuracymarker-stub').exists());
	});

	it('doesnt renders accuracy marker if old', () => {
		const wrapper = shallowMount(MapUserMarker, {
			parentComponent: parent,
			mocks
		});

		wrapper.setData({
			mapObject,
			accuracy: 51,
			lat: 0,
			lng: 0,
			timestamp: 0
		});

		wrapper.vm.checkIfOld();

		assert.isFalse(wrapper.find('mapuseraccuracymarker-stub').exists());
	});


	it('removes marker when destroyed', () => {
		global.clearInterval = sinon.stub();

		const wrapper = shallowMount(MapUserMarker, {
			parentComponent: parent,
			mocks
		});
		wrapper.setData({
			checkOldInterval: 'interval',
			mapObject
		});

		wrapper.destroy();
		assert.isTrue(parent.methods.removeObject.calledOnce);
		assert.isTrue(parent.methods.removeObject.calledWith(mapObject));
		assert.isTrue(mocks.$bus.$off.calledOnce);
		assert.isTrue(global.clearInterval.calledOnce);
		assert.isTrue(global.clearInterval.calledWith('interval'));

	});


	it('emits events when detects click', () => {

		const wrapper = shallowMount(MapUserMarker, {
			mocks
		});

		wrapper.vm.lat = 0;
		wrapper.vm.lng = 0;

		wrapper.trigger('click');
		assert.isTrue(mocks.$bus.$emit.calledOnce);
		assert.isTrue(mocks.$bus.$emit.calledWith('user-marker-click', {
			lat: 0,
			lng: 0
		}));
	});

	it('responds to right click event by going to marker', () => {
		mocks.$bus = new Vue();
		const mapSetViewStub = sinon.stub(mapService, 'setView');

		const wrapper = shallowMount(MapUserMarker, {
			mocks
		});

		wrapper.setData({
			lat: 1,
			lng: 1
		});

		mocks.$bus.$emit('goToUserMarker');

		assert.isTrue(mapSetViewStub.calledOnce);
		assert.isTrue(mapSetViewStub.calledWith([1, 1]));
	});

	it('adds class and sets old to false if timestamp is old', () => {
		const wrapper = shallowMount(MapUserMarker, {
			mocks
		});

		wrapper.setData({
			mapObject,
			timestamp: Date.now() - 6 * 60 * 1000
		});

		wrapper.vm.checkIfOld();

		assert.isTrue(divIcon.firstChild.classList.add.calledOnce);
		assert.isTrue(divIcon.firstChild.classList.add.calledWith('map__user-marker--old'));
		assert.isTrue(wrapper.vm.isOld);
	});

	it('removes class and sets old to false if timestamp is new', () => {
		const wrapper = shallowMount(MapUserMarker, {
			mocks
		});

		wrapper.setData({
			mapObject,
			timestamp: Date.now() - 3 * 60 * 1000
		});

		wrapper.vm.checkIfOld();

		assert.isTrue(divIcon.firstChild.classList.remove.calledOnce);
		assert.isTrue(divIcon.firstChild.classList.remove.calledWith('map__user-marker--old'));
		assert.isFalse(wrapper.vm.isOld);
	});
});
