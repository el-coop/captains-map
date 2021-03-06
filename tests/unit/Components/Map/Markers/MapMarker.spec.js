import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import MapMarker from '@/Components/Map/Markers/MapMarker';
import leaflet from 'leaflet';
import mapService from '@/Services/LeafletMapService';
import sinon from 'sinon';

describe('MapMarker.vue', () => {
	const parent = {
		methods: {
			addObject: sinon.spy(),
			removeObject: sinon.spy()
		}
	};


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
			parentComponent: parent,
			propsData: {
				marker
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

	it('Removes marker when destroyed', () => {
		sinon.stub(leaflet, 'marker').returns(marker);
		sinon.stub(mapService, 'addObject');

		const wrapper = shallowMount(MapMarker, {
			parentComponent: parent,
			propsData: {
				marker
			}
		});

		wrapper.destroy();
		assert.isTrue(parent.methods.removeObject.calledOnce);
		assert.isTrue(parent.methods.removeObject.calledWith(marker));
	});


	it('Emit events when detects click', () => {
		const $bus = {
			$emit: sinon.stub()
		};
		sinon.stub(leaflet, 'marker').returns(marker);

		const wrapper = shallowMount(MapMarker, {
			parentComponent: parent,
			mocks: {
				$bus,
			},
			propsData: {
				marker
			}
		});

		wrapper.vm.onClick();
		assert.isTrue($bus.$emit.calledOnce);
		assert.isTrue($bus.$emit.calledWith('marker-click', wrapper.vm.$props.marker));
	});

});
