import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import UserMarker from '@/components/map/Markers/UserMarker';
import leaflet from 'leaflet';
import mapService from '@/services/leaflet.service';
import sinon from 'sinon';

describe('UserMarker.vue', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('watches for location when created', () => {
		const addWatchLocationStub = sinon.stub(mapService, 'watchLocation');
		const wrapper = shallowMount(UserMarker);

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
		const addMarkerStub = sinon.stub(mapService, 'addObject');

		const wrapper = shallowMount(UserMarker);

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
		assert.isTrue(addMarkerStub.calledOnce);
		assert.isTrue(addMarkerStub.calledWith(marker));
	});


	it('updates location for already existent marker', () => {
		const marker = {};
		marker.setLatLng = sinon.stub();

		const icon = sinon.spy();
		const createIconStub = sinon.stub(leaflet, 'divIcon').returns(icon);
		const createMarkerStub = sinon.stub(leaflet, 'marker').returns(marker);
		const addMarkerStub = sinon.stub(mapService, 'addObject');

		const wrapper = shallowMount(UserMarker);

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
		assert.isFalse(addMarkerStub.called);
		assert.isTrue(marker.setLatLng.calledOnce);
		assert.isTrue(marker.setLatLng.calledWith({
			lat: 0,
			lng: 0
		}));
	});

	it('renders accuracy marker', () => {

		const wrapper = shallowMount(UserMarker);

		wrapper.vm.setLocation({
			accuracy: 51,
			latlng: {
				lat: 0,
				lng: 0
			}
		});

		assert.isTrue(wrapper.find('useraccuracymarker-stub').exists());
	});


	it('removes marker when destroyed', () => {
		const marker = {};
		const removeMarkerStub = sinon.stub(mapService, 'removeObject');

		const wrapper = shallowMount(UserMarker);
		wrapper.vm.mapObject = marker;

		wrapper.destroy();
		assert.isTrue(removeMarkerStub.calledOnce);
		assert.isTrue(removeMarkerStub.calledWith(marker));
	});


	it('emits events when detects click', () => {
		const $bus = {
			$emit() {

			}
		};
		const busEmit = sinon.stub($bus, '$emit');

		const wrapper = shallowMount(UserMarker, {
			mocks: {
				$bus,
			},
		});

		wrapper.vm.lat = 0;
		wrapper.vm.lng = 0;

		wrapper.vm.onClick();
		assert.isTrue(busEmit.calledOnce);
		assert.isTrue(busEmit.calledWith('user-marker-click', {
			lat: 0,
			lng: 0
		}));
	});
});