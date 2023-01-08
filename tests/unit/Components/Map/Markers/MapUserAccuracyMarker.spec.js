import {describe, it, expect, afterEach} from 'vitest';
import {shallowMount} from '@vue/test-utils';
import MapUserAccuracyMarker from '@/Components/Map/Markers/MapUserAccuracyMarker.vue';
import leaflet from 'leaflet';
import sinon from 'sinon';

describe('MapUserAccuracyMarker.vue', () => {

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

		const wrapper = shallowMount(MapUserAccuracyMarker, {
			props: {
				accuracy: 100,
				lat: 10,
				lng: 10
			}
		});

		expect(wrapper.find('div').exists()).toBeTruthy();
		expect(createIconStub.calledOnce).toBeTruthy();
		expect(createIconStub.calledWith({
			html: wrapper.vm.$el.outerHTML,
			iconSize: [50, 50]
		})).toBeTruthy();
		expect(createMarkerStub.calledOnce).toBeTruthy();
		expect(createMarkerStub.calledWith([10, 10], {icon})).toBeTruthy();
		expect(marker.on.calledOnce).toBeTruthy();
		expect(marker.on.calledWith('click')).toBeTruthy();
		expect(wrapper.emitted()).toHaveProperty('add-to-map');
		const addToMapEvent = wrapper.emitted('add-to-map');
		expect(addToMapEvent[0]).toEqual([marker]);
	});


	it('updates location for already existent marker', async () => {
		const marker = {};
		marker.setLatLng = sinon.stub();
		marker.on = sinon.stub();

		sinon.stub(leaflet, 'marker').returns(marker);

		const wrapper = shallowMount(MapUserAccuracyMarker, {
			props: {
				accuracy: 100,
				lat: 10,
				lng: 10
			}
		});

		wrapper.vm.mapObject = marker;

		await wrapper.setProps({
			lat: 11
		});

		await wrapper.setProps({
			lng: 12
		});

		expect(marker.setLatLng.calledTwice).toBeTruthy();
		expect(marker.setLatLng.calledWith({lat: 11, lng: 10})).toBeTruthy();
		expect(marker.setLatLng.calledWith({lat: 11, lng: 12})).toBeTruthy();
	});

	it('updates icon size when accuracy changes', async () => {
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

		const wrapper = shallowMount(MapUserAccuracyMarker, {
			props: {
				accuracy: 100,
				lat: 10,
				lng: 10
			}
		});


		wrapper.vm.mapObject = marker;

		await wrapper.setProps({
			accuracy: 50
		});

		expect(marker.setIcon.calledOnce).toBeTruthy();
		expect(marker.setIcon.calledWith({
			options: {
				iconSize: [25, 25]
			}
		})).toBeTruthy();
	});


	it('It removes marker when destroyed', () => {
		const marker = {};
		const parent = {
			methods: {
				addObject: sinon.spy(),
				removeObject: sinon.spy()
			}
		};


		const wrapper = shallowMount(MapUserAccuracyMarker, {
			props: {
				accuracy: 100,
				lat: 10,
				lng: 10
			}
		});

		wrapper.vm.mapObject = marker;

		wrapper.unmount();
		expect(wrapper.emitted()).toHaveProperty('remove-from-map');
		const removeFromMapEvent = wrapper.emitted('remove-from-map');
		expect(removeFromMapEvent[0]).toEqual([marker]);
	});


	it('emit events when detects click', () => {
		const wrapper = shallowMount(MapUserAccuracyMarker, {
			props: {
				accuracy: 100,
				lat: 10,
				lng: 10
			}
		});

		wrapper.vm.onClick();
		expect(wrapper.emitted()).toHaveProperty('user-marker-click');
		const userMarkerClickEvent = wrapper.emitted('user-marker-click');
		expect(userMarkerClickEvent[0]).toEqual([{
			latlng: {
				lat: 10,
				lng: 10
			}
		}]);

	});
});
