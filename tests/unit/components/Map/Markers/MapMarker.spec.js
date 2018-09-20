import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import MapMarker from '@/components/map/Markers/MapMarker';
import leaflet from 'leaflet';
import mapService from '@/services/leaflet.service';
import sinon from 'sinon';

describe('MapMarker.vue', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('Adds marker to map on creation', () => {
		const marker = {};
		marker.on = sinon.stub().returns(marker);

		const icon = sinon.spy();
		const createIconStub = sinon.stub(leaflet, 'divIcon').returns(icon);
		const createMarkerStub = sinon.stub(leaflet, 'marker').returns(marker);
		const addMarkerStub = sinon.stub(mapService, 'addMarker');
		const wrapper = shallowMount(MapMarker, {
			propsData: {
				marker: {
					media: {
						path: '/images/test.jpg'
					},
					lat: 0,
					lng: 0,
					type: 'image',
				}
			}
		});
		assert.isTrue(wrapper.find('div').exists());
		assert.isTrue(createIconStub.calledOnce);
		assert.isTrue(createIconStub.calledWith({
			html: '<div class="map__icon-wrapper"><img src="/api/thumbnails/test.jpg" class="map__icon-image"></div>',
			iconSize: ['auto', 'auto']
		}));
		assert.isTrue(createMarkerStub.calledOnce);
		assert.isTrue(createMarkerStub.calledWith([0, 0], {icon}));
		assert.isTrue(marker.on.calledOnce);
		assert.isTrue(marker.on.calledWith('click'));
		assert.isTrue(addMarkerStub.calledOnce);
		assert.isTrue(addMarkerStub.calledWith(marker));
	});

	it('It removes marker when destroyed', () => {
		const marker = {};
		marker.on = sinon.stub().returns(marker);
		sinon.stub(leaflet, 'marker').returns(marker);
		sinon.stub(mapService, 'addMarker');
		const removeMarkerStub = sinon.stub(mapService, 'removeMarker');

		const wrapper = shallowMount(MapMarker, {
			propsData: {
				marker: {
					media: {
						path: '/images/test.jpg'
					},
					lat: 0,
					lng: 0,
					type: 'image',
				}
			}
		});

		wrapper.destroy();
		assert.isTrue(removeMarkerStub.calledOnce);
		assert.isTrue(removeMarkerStub.calledWith(marker));
	});


	it('It emit events when detects click', () => {
		const $bus = {
			$emit() {

			}
		};
		const busEmit = sinon.stub($bus, '$emit');
		const marker = {};
		marker.on = sinon.stub().returns(marker);
		sinon.stub(leaflet, 'marker').returns(marker);
		sinon.stub(mapService, 'addMarker');

		const wrapper = shallowMount(MapMarker, {
			mocks: {
				$bus,
			},
			propsData: {
				marker: {
					media: {
						path: '/images/test.jpg'
					},
					lat: 0,
					lng: 0,
					type: 'image',
				}
			}
		});

		wrapper.vm.onClick();
		assert.isTrue(busEmit.calledOnce);
		assert.isTrue(busEmit.calledWith('marker-click', wrapper.vm.$props.marker));
	});
});
