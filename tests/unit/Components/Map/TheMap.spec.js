import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Map from '@/Components/Map/TheMap.vue';
import mapService from '@/Services/LeafletMapService';
import sinon from 'sinon';

const pageSize = parseInt(process.env.VUE_APP_PAGE_SIZE);

describe('TheMap.vue', () => {

	let mocks;

	beforeEach(() => {
		mocks = {
			$store: {
				state: {
					Markers: {
						markers: [],
						page: 0
					},
					Uploads: {
						queue: [],
						errored: []
					}
				}
			},
			$router: {
				currentRoute: {
					name: 'view'
				}
			}
		};
	});

	afterEach(() => {
		sinon.restore();
	});

	it('renders without markers', () => {
		const wrapper = shallowMount(Map, {
			mocks
		});
		assert.isTrue(wrapper.find('.map').exists());
		assert.isFalse(wrapper.find('usermarker-stub').exists());
		assert.isFalse(wrapper.find('mapmarker-stub').exists());
	});

	it('Initiates maps and listeners', () => {
		const mapInitStub = sinon.stub(mapService, 'init');
		const mapOnStub = sinon.stub(mapService, 'on');
		const wrapper = shallowMount(Map, {
			mocks
		});
		assert.isTrue(mapInitStub.calledOnce);
		assert.isTrue(mapInitStub.calledWith(wrapper.vm.$refs.map, wrapper.vm.$props.center, wrapper.vm.$props.zoom));

		assert.isTrue(mapOnStub.calledTwice);
		assert.isTrue(mapOnStub.calledWith('contextmenu', wrapper.vm.rightClick));
		assert.isTrue(mapOnStub.calledWith('zoomend', wrapper.vm.handleZoom));
	});

	it('renders markers', () => {
		mocks.$store.state.Markers.markers = [
			{id: 1}, {id: 2}, {id: 3}
		];
		const wrapper = shallowMount(Map, {
			mocks
		});
		assert.equal(wrapper.findAll('map-marker-stub').length, 3);
	});

	it('renders second page of markers markers', () => {
		mocks.$store.state.Markers.markers = new Array(pageSize).fill({});
		mocks.$store.state.Markers.markers.push({id: 1}, {id: 2}, {id: 3});
		mocks.$store.state.Markers.page = 1;
		const wrapper = shallowMount(Map, {
			mocks
		});
		assert.equal(wrapper.findAll('map-marker-stub').length, 3);
	});

	it('renders userMarker', () => {
		mocks.$store.state.Markers.userMarker = true;

		const wrapper = shallowMount(Map, {
			mocks
		});
		assert.isTrue(wrapper.find('mapusermarker-stub').exists());
	});

	it('reacts to zoom change', () => {
		const wrapper = shallowMount(Map, {
			mocks
		});

		wrapper.vm.handleZoom({
			target: {
				_animateToZoom: 4
			}
		});
		assert.isTrue(wrapper.find('.zoom-far').exists());


		wrapper.vm.handleZoom({
			target: {
				_animateToZoom: 9
			}
		});
		assert.isTrue(wrapper.find('.zoom-medium').exists());


		wrapper.vm.handleZoom({
			target: {
				_animateToZoom: 14
			}
		});
		assert.isTrue(wrapper.find('.zoom-normal').exists());


		wrapper.vm.handleZoom({
			target: {
				_animateToZoom: 18
			}
		});
		assert.isTrue(wrapper.find('.zoom-close').exists());
	});

	it('reacts to right click event', () => {
		mocks.$bus = {
			$emit: sinon.stub()
		};
		const wrapper = shallowMount(Map, {
			mocks
		});
		const event = sinon.stub();


		wrapper.vm.rightClick(event);
		assert.isTrue(mocks.$bus.$emit.calledOnce);
		assert.isTrue(mocks.$bus.$emit.calledWith('map-right-click', {event}));
	});

	it('renders the queue markers when it has entries and mode is edit', () => {
		mocks.$store.state.Uploads.queue = [{
			uploadTime: 1
		}, {
			uploadTime: 2
		}];
		mocks.$router.currentRoute.name = 'edit';

		const wrapper = shallowMount(Map, {
			mocks
		});

		const queueMarkers = wrapper.findAll('upload-marker-stub');

		assert.equal(queueMarkers.length, 2);
		assert.equal(queueMarkers.filter((element) => {
			return element.attributes().status === 'queued';
		}).length, 2);
	});

	it('doesnt render the queue markers when it has entries and mode isnt edit', () => {
		mocks.$store.state.Uploads.queue = [{
			uploadTime: 1
		}, {
			uploadTime: 2
		}];
		const wrapper = shallowMount(Map, {
			mocks
		});

		const queueMarkers = wrapper.findAll('upload-marker-stub');

		assert.equal(queueMarkers.length, 0);
	});

	it('renders the errored markers when it has entries and mode is edit', () => {
		mocks.$store.state.Uploads.errored = [{
			uploadTime: 1
		}, {
			uploadTime: 2
		}];
		mocks.$router.currentRoute.name = 'edit';

		const wrapper = shallowMount(Map, {
			mocks
		});

		const queueMarkers = wrapper.findAll('upload-marker-stub');

		assert.equal(queueMarkers.length, 2);
		assert.equal(queueMarkers.filter((element) => {
			return element.attributes().status === 'error';
		}).length, 2);
	});

	it('doesnt render the errored markers it has entries and mode isnt edit', () => {
		mocks.$store.state.Uploads.errored = [{
			uploadTime: 1
		}, {
			uploadTime: 2
		}];
		const wrapper = shallowMount(Map, {
			mocks
		});

		const queueMarkers = wrapper.findAll('upload-marker-stub');

		assert.equal(queueMarkers.length, 0);
	});
});
