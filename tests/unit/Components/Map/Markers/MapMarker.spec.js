import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import { shallowMount } from '@vue/test-utils';
import MapMarker from '@/Components/Map/Markers/MapMarker.vue';
import leaflet from 'leaflet';
import mapService from '@/Services/LeafletMapService';
import sinon from 'sinon';

describe('MapMarker.vue', () => {

	const marker = {
		media: {
			path: '/images/test.jpg'
		},
		lat: 0,
		lng: 0,
		type: 'image',
		user: {
			username: 'test'
		},
	};
	let stubs = {
		FontAwesomeIcon: true,
	}

	beforeEach(() => {
		marker.on = sinon.stub().returns(marker);
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Adds marker to map on creation', () => {
		const icon = sinon.spy();
		const createIconStub = sinon.stub(leaflet, 'divIcon').returns(icon);
		const createMarkerStub = sinon.stub(leaflet, 'marker').returns(marker);
		const wrapper = shallowMount(MapMarker, {
			global: {
				stubs
			},
			props: {
				marker
			}
		});
		expect(wrapper.find('div').exists()).toBeTruthy();
		expect(createIconStub.calledOnce).toBeTruthy();
		expect(createIconStub.calledWith({
			html: wrapper.vm.$el.outerHTML,
			iconSize: ['auto', 'auto']
		})).toBeTruthy();
		expect(createMarkerStub.calledOnce).toBeTruthy();
		expect(marker.on.calledOnce).toBeTruthy();
		expect(marker.on.calledWith('click')).toBeTruthy();

		expect(wrapper.emitted()).toHaveProperty('add-to-map');
		const addToMapEvent = wrapper.emitted('add-to-map');
		expect(addToMapEvent[0]).toEqual([marker]);

	});

	it('Removes marker when destroyed', () => {
		sinon.stub(leaflet, 'marker').returns(marker);
		sinon.stub(mapService, 'addObject');

		const wrapper = shallowMount(MapMarker, {
			global: {
				stubs
			},
			props: {
				marker
			}
		});

		wrapper.unmount();


		expect(wrapper.emitted()).toHaveProperty('remove-from-map');
		const removeFromMapEvent = wrapper.emitted('remove-from-map');
		expect(removeFromMapEvent[0]).toEqual([marker]);
	});


	it('Emit events when detects click', () => {
		sinon.stub(leaflet, 'marker').returns(marker);

		const wrapper = shallowMount(MapMarker, {
			global: {
				stubs
			},
			props: {
				marker
			}
		});

		wrapper.vm.onClick();

		expect(wrapper.emitted()).toHaveProperty('marker-click');
		const markerClickEvent = wrapper.emitted('marker-click');
		expect(markerClickEvent[0]).toEqual([marker]);
	});

});
