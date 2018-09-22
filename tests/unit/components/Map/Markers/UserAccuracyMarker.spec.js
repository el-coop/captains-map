import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import UserAccuracyMarker from '@/components/map/Markers/UserAccuracyMarker';
import leaflet from 'leaflet';
import mapService from '@/services/leaflet.service';
import sinon from 'sinon';

describe('UserAccuracyMarker.vue', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('renders', () => {
		const marker = {};
		marker.on = sinon.stub().returns(marker);
		marker.setLatLng = sinon.stub();

		const icon = sinon.spy();
		const createIconStub = sinon.stub(leaflet, 'divIcon').returns(icon);
		const createMarkerStub = sinon.stub(leaflet, 'marker').returns(marker);
		const addMarkerStub = sinon.stub(mapService, 'addObject');

		const wrapper = shallowMount(UserAccuracyMarker, {
			propsData: {
				accuracy: 100,
				lat: 10,
				lng: 10
			}
		});

		assert.isTrue(wrapper.find('div').exists());
		assert.isTrue(createIconStub.calledOnce);
		assert.isTrue(createIconStub.calledWith({
			html: wrapper.vm.$el.outerHTML,
			iconSize: [50, 50]
		}));
		assert.isTrue(createMarkerStub.calledOnce);
		assert.isTrue(createMarkerStub.calledWith([10, 10], {icon}));
		assert.isTrue(marker.on.calledOnce);
		assert.isTrue(marker.on.calledWith('click'));
		assert.isTrue(addMarkerStub.calledOnce);
		assert.isTrue(addMarkerStub.calledWith(marker));
	});


	it('updates location for already existent marker', () => {
		const marker = {};
		marker.setLatLng = sinon.stub();
		marker.on = sinon.stub();

		sinon.stub(leaflet, 'marker').returns(marker);
		sinon.stub(mapService, 'addObject');

		const wrapper = shallowMount(UserAccuracyMarker, {
			propsData: {
				accuracy: 100,
				lat: 10,
				lng: 10
			}
		});

		wrapper.vm.mapObject = marker;

		wrapper.setProps({
			lat: 11
		});

		wrapper.setProps({
			lng: 12
		});

		assert.isTrue(marker.setLatLng.calledTwice);
		assert.isTrue(marker.setLatLng.calledWith([11, 10]));
		assert.isTrue(marker.setLatLng.calledWith([11, 12]));
	});

	it('updates icon size when accuracy changes', () => {
		const marker = {
			options: {
				icon: {
					options: {
						iconSize: [10, 10]
					}
				}
			},
			setIcon: sinon.spy()
		};

		const wrapper = shallowMount(UserAccuracyMarker, {
			propsData: {
				accuracy: 100,
				lat: 10,
				lng: 10
			}
		});

		wrapper.vm.mapObject = marker;

		wrapper.setProps({
			accuracy: 50
		});

		assert.isTrue(marker.setIcon.calledOnce);
		assert.isTrue(marker.setIcon.calledWith({
			options: {
				iconSize: [25, 25]
			}
		}));
	});


	it('It removes marker when destroyed', () => {
		const marker = {};
		const removeMarkerStub = sinon.stub(mapService, 'removeObject');

		const wrapper = shallowMount(UserAccuracyMarker, {
			propsData: {
				accuracy: 100,
				lat: 10,
				lng: 10
			}
		});
		wrapper.vm.mapObject = marker;

		wrapper.destroy();
		assert.isTrue(removeMarkerStub.calledOnce);
		assert.isTrue(removeMarkerStub.calledWith(marker));
	});


	it('emit events when detects click', () => {
		const $bus = {
			$emit() {

			}
		};
		const busEmit = sinon.stub($bus, '$emit');

		const wrapper = shallowMount(UserAccuracyMarker, {
			mocks: {
				$bus,
			},
			propsData: {
				accuracy: 100,
				lat: 10,
				lng: 10
			}
		});

		wrapper.vm.onClick();
		assert.isTrue(busEmit.calledOnce);
		assert.isTrue(busEmit.calledWith('user-marker-click', {
			lat: 10,
			lng: 10
		}));
	});
});
