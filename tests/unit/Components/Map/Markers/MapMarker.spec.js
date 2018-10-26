import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import MapMarker from '@/Components/Map/Markers/MapMarker';
import leaflet from 'leaflet';
import mapService from '@/Services/LeafletMapService';
import sinon from 'sinon';

describe('MapMarker.vue', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('Adds marker to map on creation', () => {
		const marker = {};
		const parent = {
			methods: {
				addObject: sinon.spy()
			}
		};
		marker.on = sinon.stub().returns(marker);
		const icon = sinon.spy();
		const createIconStub = sinon.stub(leaflet, 'divIcon').returns(icon);
		const createMarkerStub = sinon.stub(leaflet, 'marker').returns(marker);
		const wrapper = shallowMount(MapMarker, {
			parentComponent: parent,
			propsData: {
				marker: {
					media: {
						path: '/images/test.jpg'
					},
					lat: 0,
					lng: 0,
					type: 'image',
					user: {
						username: 'test'
					}
				}
			}
		});
		assert.isTrue(wrapper.find('div').exists());
		assert.isTrue(createIconStub.calledOnce);
		assert.isTrue(createIconStub.calledWith({
			html: wrapper.vm.$el.outerHTML,
			iconSize: ['auto', 'auto']
		}));
		assert.isTrue(createMarkerStub.calledOnce);
		assert.isTrue(parent.methods.addObject.calledOnce);
		assert.isTrue(parent.methods.addObject.calledWith(marker));
		assert.isTrue(marker.on.calledOnce);
		assert.isTrue(marker.on.calledWith('click'));
	});

	it('It removes marker when destroyed', () => {
		const marker = {};
		marker.on = sinon.stub().returns(marker);
		sinon.stub(leaflet, 'marker').returns(marker);
		sinon.stub(mapService, 'addObject');
		const parent = {
			methods: {
				addObject: sinon.spy(),
				removeObject: sinon.spy()
			}
		};

		const wrapper = shallowMount(MapMarker, {
			parentComponent: parent,
			propsData: {
				marker: {
					media: {
						path: '/images/test.jpg'
					},
					lat: 0,
					lng: 0,
					type: 'image',
					user: {
						username: 'test'
					}
				}
			}
		});

		wrapper.destroy();
		assert.isTrue(parent.methods.removeObject.calledOnce);
		assert.isTrue(parent.methods.removeObject.calledWith(marker));
	});


	it('It emit events when detects click', () => {
		const $bus = {
			$emit() {

			}
		};
		const parent = {
			methods: {
				addObject: sinon.spy(),
				removeObject: sinon.spy()
			}
		};
		const busEmit = sinon.stub($bus, '$emit');
		const marker = {};
		marker.on = sinon.stub().returns(marker);
		sinon.stub(leaflet, 'marker').returns(marker);

		const wrapper = shallowMount(MapMarker, {
			parentComponent: parent,
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
					user: {
						username: 'test'
					}
				}
			}
		});

		wrapper.vm.onClick();
		assert.isTrue(busEmit.calledOnce);
		assert.isTrue(busEmit.calledWith('marker-click', wrapper.vm.$props.marker));
	});
});
