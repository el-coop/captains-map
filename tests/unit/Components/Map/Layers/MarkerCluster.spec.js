import {describe, it, expect, afterEach} from 'vitest';
import { shallowMount } from '@vue/test-utils';
import MapMarkerCluster from '@/Components/Map/Layers/MapMarkerCluster.vue';
import sinon from 'sinon';
import leaflet from 'leaflet';

describe('MapMarkerCluster.vue', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('Renders', () => {
		leaflet.markerClusterGroup = sinon.spy();
		const wrapper = shallowMount(MapMarkerCluster);

		expect(wrapper.find('.map__marker').exists()).toBeTruthy();
	});

	it('creates markerCluster', () => {

		const cluster = {
			addLayer: sinon.spy()
		};
		leaflet.markerClusterGroup = sinon.stub().returns(cluster);

		const wrapper = shallowMount(MapMarkerCluster);

		expect(leaflet.markerClusterGroup.calledOnce).toBeTruthy();
		expect(wrapper.emitted()).toHaveProperty('add-to-map');
	});

	it('Adds marker to cluster', () => {
		const cluster = {
			addLayer: sinon.spy()
		};
		const marker = {};
		leaflet.markerClusterGroup = sinon.stub().returns(cluster);

		const wrapper = shallowMount(MapMarkerCluster);

		wrapper.vm.addObject(marker);

		expect(cluster.addLayer.calledOnce).toBeTruthy();
		expect(cluster.addLayer.calledWith(marker)).toBeTruthy();
	});

	it('Queues adding markers when no object', () => {
		const cluster = {
			addLayer: sinon.spy()
		};
		const marker = {};
		leaflet.markerClusterGroup = sinon.stub().returns(cluster);

		const wrapper = shallowMount(MapMarkerCluster);

		wrapper.vm.mapObject = null;

		wrapper.vm.addObject(marker);


		expect(wrapper.vm.queuedActions.length).toBe(1);
		expect(wrapper.vm.queuedActions[0]).toEqual(['addObject',[marker]]);
	});

	it('Removes layer from cluster', () => {
		const cluster = {
			removeLayer: sinon.spy()
		};
		const marker = {};
		leaflet.markerClusterGroup = sinon.stub().returns(cluster);

		const wrapper = shallowMount(MapMarkerCluster);

		wrapper.vm.removeObject(marker);

		expect(cluster.removeLayer.calledOnce).toBeTruthy();
		expect(cluster.removeLayer.calledWith(marker)).toBeTruthy();
	});

	it('Removes control when destroyed', () => {
		const cluster = {
			removeLayer: sinon.spy()
		};
		leaflet.markerClusterGroup = sinon.stub().returns(cluster);

		const wrapper = shallowMount(MapMarkerCluster);

		wrapper.unmount();
		expect(wrapper.emitted()).toHaveProperty('remove-from-map');
	});

	it('Generates icon',() => {
		const cluster = {
			getChildCount: sinon.stub().returns(2),
			getAllChildMarkers: sinon.stub().returns([{
				id: 0,
				options: {
					icon: {
						options: {
							html: '0'
						}
					}
				}
			},{
				id: 1,
				options: {
					icon: {
						options: {
							html: '1'
						}
					}
				}

			}])
		};
		const divIconStub = sinon.stub(leaflet,'divIcon');
		leaflet.markerClusterGroup = sinon.stub().returns(cluster);

		const wrapper = shallowMount(MapMarkerCluster);

		wrapper.vm.createIcon(cluster);

		expect(divIconStub.calledOnce).toBeTruthy();
		expect(divIconStub.calledWith({
			html: `<div class="map__cluster-wrapper">1` +
				`<span class="map__cluster-wrapper-counter">2</span>` +
				`</div>`,
			iconSize: ['auto', 'auto']
		})).toBeTruthy();


	});

});
