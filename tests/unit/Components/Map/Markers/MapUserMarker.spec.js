import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import {shallowMount} from '@vue/test-utils';
import MapUserMarker from '@/Components/Map/Markers/MapUserMarker.vue';
import leaflet from 'leaflet';
import mapService from '@/Services/LeafletMapService';
import sinon from 'sinon';

describe('MapUserMarker.vue', () => {

	let mocks;
	let mapObject;
	let divIcon;
	let addWatchLocationStub;

	beforeEach(() => {
		sinon.stub(mapService, 'goToCurrentLocation');
		addWatchLocationStub = sinon.stub(mapService, 'watchLocation');
		sinon.stub(mapService, 'stopLocate');

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
			getElement: sinon.stub().returns(divIcon),
			locate: sinon.stub()
		};
	});

	afterEach(() => {
		sinon.restore();
	});

	it('watches for location when created', () => {
		const wrapper = shallowMount(MapUserMarker);

		expect(wrapper.find('div').exists()).toBeTruthy();
		expect(addWatchLocationStub.calledOnce).toBeTruthy();
	});


	it('adds a marker when location is found and sets interval check', () => {
		global.setInterval = sinon.stub();
		const icon = sinon.spy();
		const createIconStub = sinon.stub(leaflet, 'divIcon').returns(icon);
		const createMarkerStub = sinon.stub(leaflet, 'marker').returns(mapObject);

		const wrapper = shallowMount(MapUserMarker, {
			global: {
				mocks
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

		expect(createIconStub.calledOnce).toBeTruthy();
		expect(createIconStub.calledWith({
			html: wrapper.vm.$el.outerHTML,
			iconSize: [20, 20]
		})).toBeTruthy();
		expect(createMarkerStub.calledOnce).toBeTruthy();
		expect(createMarkerStub.calledWith([0, 0], {icon})).toBeTruthy();
		expect(mapObject.on.calledOnce).toBeTruthy();
		expect(mapObject.on.calledWith('click')).toBeTruthy();
		expect(wrapper.emitted()).toHaveProperty('add-to-map');
		const addToMapEvent = wrapper.emitted('add-to-map');
		expect(addToMapEvent[0]).toEqual([mapObject]);
		expect(mocks.$toast.info.calledOnce).toBeTruthy();
		expect(mocks.$toast.info.calledWith('You can now go to your location by holding the location icon. (right click on desktop)', '')).toBeTruthy();
		expect(global.setInterval.calledOnce).toBeTruthy();
		expect(divIcon.firstChild.classList.remove.calledOnce).toBeTruthy();
		expect(divIcon.firstChild.classList.remove.calledWith('map__user-marker--old')).toBeTruthy();
	});

	it('doesnt set interval if already set', async () => {
		global.setInterval = sinon.stub();
		const icon = sinon.spy();
		sinon.stub(leaflet, 'divIcon').returns(icon);
		sinon.stub(leaflet, 'marker').returns(mapObject);

		const wrapper = shallowMount(MapUserMarker, {
			global: {
				mocks
			}
		});

		await wrapper.setData({
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

		expect(global.setInterval.called).toBeFalsy();
	});


	it('updates location for already existent marker', async () => {

		const icon = sinon.spy();
		const createIconStub = sinon.stub(leaflet, 'divIcon').returns(icon);
		const createMarkerStub = sinon.stub(leaflet, 'marker').returns(mapObject);

		const wrapper = shallowMount(MapUserMarker, {
			global: {
				mocks
			}
		});

		await wrapper.setData({
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

		expect(createIconStub.called).toBeFalsy;
		expect(createMarkerStub.called).toBeFalsy;
		expect(wrapper.emitted()).not.toHaveProperty('add-to-map');
		expect(mapObject.setLatLng.calledOnce).toBeTruthy();
		expect(mapObject.setLatLng.calledWith({
			lat: 0,
			lng: 0
		})).toBeTruthy();
		expect(divIcon.firstChild.classList.remove.calledOnce).toBeTruthy();
		expect(divIcon.firstChild.classList.remove.calledWith('map__user-marker--old')).toBeTruthy();
	});

	it('renders accuracy marker',async () => {
		const wrapper = shallowMount(MapUserMarker, {
			global: {
				mocks
			}
		});

		await wrapper.setData({
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

		await wrapper.vm.$nextTick();

		expect(wrapper.find('map-user-accuracy-marker-stub').exists()).toBeTruthy();
	});

	it('doesnt renders accuracy marker if old', async () => {
		const wrapper = shallowMount(MapUserMarker, {
			global: {
				mocks
			}
		});

		await wrapper.setData({
			mapObject,
			accuracy: 51,
			lat: 0,
			lng: 0,
			timestamp: 0
		});

		wrapper.vm.checkIfOld();

		await wrapper.vm.$nextTick();

		expect(wrapper.find('map-user-accuracy-marker-stub').exists()).toBeFalsy();
	});


	it('removes marker when destroyed', async () => {
		global.clearInterval = sinon.stub();

		const wrapper = shallowMount(MapUserMarker, {
			global: {
				mocks
			}
		});

		await wrapper.setData({
			checkOldInterval: 'interval',
			mapObject
		});

		wrapper.unmount();
		expect(wrapper.emitted()).toHaveProperty('remove-from-map');
		const removeFromMapEvent = wrapper.emitted('remove-from-map');
		expect(removeFromMapEvent[0]).toEqual([mapObject]);
		expect(global.clearInterval.calledOnce).toBeTruthy();
		expect(global.clearInterval.calledWith('interval')).toBeTruthy();

	});


	it('emits events when detects click', () => {

		const wrapper = shallowMount(MapUserMarker, {
			global: {
				mocks
			}
		});

		wrapper.vm.lat = 0;
		wrapper.vm.lng = 0;

		wrapper.trigger('click');
		expect(wrapper.emitted()).toHaveProperty('user-marker-click');
		const userMarkerClickEvent = wrapper.emitted('user-marker-click');
		expect(userMarkerClickEvent[0]).toEqual([{
			latlng: {
				lat: 0,
				lng: 0
			}
		}]);

	});

	it('responds to right click event by going to marker', async () => {
		const mapSetViewStub = sinon.stub(mapService, 'setView');

		const wrapper = shallowMount(MapUserMarker, {
			global: {
				mocks
			}
		});


		await wrapper.setData({
			lat: 1,
			lng: 1
		});

		wrapper.vm.goToMarker();

		expect(mapSetViewStub.calledOnce).toBeTruthy();
		expect(mapSetViewStub.calledWith([1, 1])).toBeTruthy();
	});

	it('adds class and sets old to false if timestamp is old', async () => {
		const wrapper = shallowMount(MapUserMarker, {
			global: {
				mocks
			}
		});

		await wrapper.setData({
			mapObject,
			timestamp: Date.now() - 6 * 60 * 1000
		});

		wrapper.vm.checkIfOld();

		expect(divIcon.firstChild.classList.add.calledOnce).toBeTruthy();
		expect(divIcon.firstChild.classList.add.calledWith('map__user-marker--old')).toBeTruthy();
		expect(wrapper.vm.isOld).toBeTruthy();
	});

	it('removes class and sets old to false if timestamp is new', async () => {
		const wrapper = shallowMount(MapUserMarker, {
			global: {
				mocks
			}
		});
		await wrapper.setData({
			mapObject,
			timestamp: Date.now() - 3 * 60 * 1000
		});

		wrapper.vm.checkIfOld();

		expect(divIcon.firstChild.classList.remove.calledOnce).toBeTruthy();
		expect(divIcon.firstChild.classList.remove.calledWith('map__user-marker--old')).toBeTruthy();
		expect(wrapper.vm.isOld).toBeFalsy();
	});
});
