import Vue from 'vue';
import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import UserMarker from '@/Components/Map/Markers/UserMarker';
import leaflet from 'leaflet';
import mapService from '@/Services/LeafletMapService';
import sinon from 'sinon';

describe('UserMarker.vue', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('watches for location when created', () => {
		const addWatchLocationStub = sinon.stub(mapService, 'watchLocation');
		const wrapper = shallowMount(UserMarker, {
			mocks: {
				$bus: {
					$on: sinon.spy()
				}
			}
		});

		assert.isTrue(wrapper.find('div').exists());
		assert.isTrue(addWatchLocationStub.calledOnce);
	});


	it('adds a marker when location is found', () => {
		const marker = {};
		marker.on = sinon.stub().returns(marker);
		marker.setLatLng = sinon.stub();

		const icon = sinon.spy();
		const createIconStub = sinon.stub(leaflet, 'divIcon').returns(icon);
		const createMarkerStub = sinon.stub(leaflet, 'marker').returns(marker);
		const parent = {
			methods: {
				addObject: sinon.spy(),
			}
		};

		const $toast = {
			info: sinon.spy(),
			hide: sinon.spy()
		};

		const wrapper = shallowMount(UserMarker, {
			parentComponent: parent,
			mocks: {
				$bus: {
					$on: sinon.spy()
				},
				$toast

			}
		});

		wrapper.vm.setLocation({
			accuracy: 10,
			latlng: {
				lat: 0,
				lng: 0
			}
		});

		assert.isTrue(createIconStub.calledOnce);
		assert.isTrue(createIconStub.calledWith({
			html: wrapper.vm.$el.outerHTML,
			iconSize: [20, 20]
		}));
		assert.isTrue(createMarkerStub.calledOnce);
		assert.isTrue(createMarkerStub.calledWith([0, 0], {icon}));
		assert.isTrue(marker.on.calledOnce);
		assert.isTrue(marker.on.calledWith('click'));
		assert.isTrue(parent.methods.addObject.calledOnce);
		assert.isTrue(parent.methods.addObject.calledWith(marker));
		assert.isTrue($toast.info.calledOnce);
		assert.isTrue($toast.info.calledWith('You can now go to your location by holding the location icon. (right click on desktop)', ''));
	});


	it('updates location for already existent marker', () => {
		const marker = {};
		marker.setLatLng = sinon.stub();

		const icon = sinon.spy();
		const createIconStub = sinon.stub(leaflet, 'divIcon').returns(icon);
		const createMarkerStub = sinon.stub(leaflet, 'marker').returns(marker);
		const parent = {
			methods: {
				addObject: sinon.spy(),
			}
		};

		const wrapper = shallowMount(UserMarker, {
			parentComponent: parent,
			mocks: {
				$bus: {
					$on: sinon.spy()
				},
			}
		});

		wrapper.vm.mapObject = marker;
		wrapper.vm.setLocation({
			accuracy: 10,
			latlng: {
				lat: 0,
				lng: 0
			}
		});

		assert.isFalse(createIconStub.called);
		assert.isFalse(createMarkerStub.called);
		assert.isFalse(parent.methods.addObject.called);
		assert.isTrue(marker.setLatLng.calledOnce);
		assert.isTrue(marker.setLatLng.calledWith({
			lat: 0,
			lng: 0
		}));
	});

	it('renders accuracy marker', () => {
		const parent = {
			methods: {
				addObject: sinon.spy(),
				removeObject: sinon.spy()
			},
		};

		const $toast = {
			info: sinon.spy(),
			hide: sinon.spy()
		};

		const wrapper = shallowMount(UserMarker, {
			parentComponent: parent,
			mocks: {
				$bus: {
					$on: sinon.spy()
				},
				$toast
			}
		});

		wrapper.vm.setLocation({
			accuracy: 51,
			latlng: {
				lat: 0,
				lng: 0
			}
		});

		assert.isTrue(wrapper.find('user-accuracy-marker-stub').exists());
	});


	it('removes marker when destroyed', () => {
		const marker = {};
		const parent = {
			methods: {
				addObject: sinon.spy(),
				removeObject: sinon.spy()
			}
		};
		const $off = sinon.spy();

		const wrapper = shallowMount(UserMarker, {
			parentComponent: parent,
			mocks: {
				$bus: {
					$on: sinon.spy(),
					$off
				},
			}
		});
		wrapper.vm.mapObject = marker;

		wrapper.destroy();
		assert.isTrue(parent.methods.removeObject.calledOnce);
		assert.isTrue(parent.methods.removeObject.calledWith(marker));
		assert.isTrue($off.calledOnce);

	});


	it('emits events when detects click', () => {
		const $bus = {
			$emit: sinon.spy(),
			$on: sinon.spy()
		};

		const wrapper = shallowMount(UserMarker, {
			mocks: {
				$bus,
			},

		});

		wrapper.vm.lat = 0;
		wrapper.vm.lng = 0;

		wrapper.vm.onClick();
		assert.isTrue($bus.$emit.calledOnce);
		assert.isTrue($bus.$emit.calledWith('user-marker-click', {
			lat: 0,
			lng: 0
		}));
	});

	it('responds to right click event by going to marker', () => {
		const $bus = new Vue();
		const mapSetViewStub = sinon.stub(mapService, 'setView');

		const wrapper = shallowMount(UserMarker, {
			mocks: {
				$bus,
			},
		});
		wrapper.vm.lat = 1;
		wrapper.vm.lng = 1;

		$bus.$emit('goToUserMarker');

		assert.isTrue(mapSetViewStub.calledOnce);
		assert.isTrue(mapSetViewStub.calledWith([1, 1]));
	});
});
