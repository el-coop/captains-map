import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import UploadMarker from '@/Components/Map/Markers/UploadMarker';
import leaflet from 'leaflet';
import mapService from '@/Services/LeafletMapService';
import sinon from 'sinon';

describe('UploadMarker.vue', () => {
	const parent = {
		methods: {
			addObject: sinon.spy(),
			removeObject: sinon.spy()
		}
	};


	let marker;

	beforeEach(() => {
		marker = {
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
		marker.on = sinon.stub().returns(marker);
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Adds marker to map on creation', () => {
		const icon = sinon.spy();
		const createIconStub = sinon.stub(leaflet, 'divIcon').returns(icon);
		const createMarkerStub = sinon.stub(leaflet, 'marker').returns(marker);
		const wrapper = shallowMount(UploadMarker, {
			parentComponent: parent,
			propsData: {
				marker
			}
		});
		assert.isTrue(wrapper.find('.map__marker--queued').exists());
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

	it('Renders the object with error status', () => {
		sinon.stub(leaflet, 'divIcon').returns(sinon.spy());
		sinon.stub(leaflet, 'marker').returns(marker);
		const wrapper = shallowMount(UploadMarker, {
			parentComponent: parent,
			propsData: {
				marker,
				status: 'error'
			}
		});
		assert.isTrue(wrapper.find('.map__marker--error').exists())
	});

	it('Removes marker when destroyed', () => {
		sinon.stub(leaflet, 'marker').returns(marker);
		sinon.stub(mapService, 'addObject');

		const wrapper = shallowMount(UploadMarker, {
			parentComponent: parent,
			propsData: {
				marker
			}
		});

		wrapper.destroy();
		assert.isTrue(parent.methods.removeObject.calledOnce);
		assert.isTrue(parent.methods.removeObject.calledWith(marker));
	});


	it('Emit events when clicks on errored marker', () => {
		marker.error = {
			status: 500
		};
		const $bus = {
			$emit: sinon.stub()
		};
		sinon.stub(leaflet, 'marker').returns(marker);

		const wrapper = shallowMount(UploadMarker, {
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
		assert.isTrue($bus.$emit.calledWith('map-right-click', {
			lat: 0,
			lng: 0,
			marker: marker
		}));
	});

	it('Doesnt emit events when clicks on queued marker', () => {

		const $bus = {
			$emit: sinon.stub()
		};
		sinon.stub(leaflet, 'marker').returns(marker);

		const wrapper = shallowMount(UploadMarker, {
			parentComponent: parent,
			mocks: {
				$bus,
			},
			propsData: {
				marker
			}
		});

		wrapper.vm.onClick();
		assert.isFalse($bus.$emit.called);

	});

});
