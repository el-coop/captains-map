import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import TheMap from '@/Components/Map/TheMap.vue';
import mapService from '@/Services/LeafletMapService';
import sinon from 'sinon';

const pageSize = parseInt(process.env.VUE_APP_PAGE_SIZE);

describe('TheMap.vue', () => {

	let mocks;
	let mapInitStub;
	let mapOnStub;

	beforeEach(() => {
		mapOnStub = sinon.stub(mapService, 'on');
		mocks = {
			$store: {
				state: {
					Markers: {
						markers: [],
						page: 0
					}
				},
				getters: {
					'Uploads/allFiles': [{
						uploadTime: 1
					}, {
						uploadTime: 2,
						error: {
							status: 500
						}
					}]
				}
			},
			$router: {
				currentRoute: {
					name: 'view'
				}
			}
		};

		mapInitStub = sinon.stub(mapService, 'init');
	});

	afterEach(() => {
		sinon.restore();
	});

	it('renders without markers', () => {
		const wrapper = shallowMount(TheMap, {
			mocks
		});
		assert.isTrue(wrapper.find('.map').exists());
		assert.isFalse(wrapper.find('usermarker-stub').exists());
		assert.isFalse(wrapper.find('mapmarker-stub').exists());
	});

	it('Initiates maps and listeners', () => {
		const wrapper = shallowMount(TheMap, {
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
		const wrapper = shallowMount(TheMap, {
			mocks
		});
		assert.equal(wrapper.findAll('mapmarker-stub').length, 3);
	});

	it('renders second page of markers markers', () => {
		mocks.$store.state.Markers.markers = new Array(pageSize).fill({});
		mocks.$store.state.Markers.markers.push({id: 1}, {id: 2}, {id: 3});
		mocks.$store.state.Markers.page = 1;
		const wrapper = shallowMount(TheMap, {
			mocks
		});
		assert.equal(wrapper.findAll('mapmarker-stub').length, 3);
	});

	it('renders userMarker', () => {
		mocks.$store.state.Markers.userMarker = true;

		const wrapper = shallowMount(TheMap, {
			mocks
		});
		assert.isTrue(wrapper.find('mapusermarker-stub').exists());
	});

	it('reacts to zoom change', () => {
		const wrapper = shallowMount(TheMap, {
			mocks
		});

		wrapper.vm.handleZoom({
			target: {
				_animateToZoom: 4
			}
		});
		assert.isTrue(wrapper.find('.map--zoom-far').exists());


		wrapper.vm.handleZoom({
			target: {
				_animateToZoom: 9
			}
		});
		assert.isTrue(wrapper.find('.map--zoom-medium').exists());


		wrapper.vm.handleZoom({
			target: {
				_animateToZoom: 14
			}
		});
		assert.isTrue(wrapper.find('.map--zoom-normal').exists());


		wrapper.vm.handleZoom({
			target: {
				_animateToZoom: 18
			}
		});
		assert.isTrue(wrapper.find('.map--zoom-close').exists());
	});

	it('reacts to right click event', () => {
		mocks.$bus = {
			$emit: sinon.stub()
		};
		const wrapper = shallowMount(TheMap, {
			mocks
		});
		const event = sinon.stub();


		wrapper.vm.rightClick(event);
		assert.isTrue(mocks.$bus.$emit.calledOnce);
		assert.isTrue(mocks.$bus.$emit.calledWith('map-create-marker', {event}));
	});

	it('renders the queue markers when it has entries and mode is edit', () => {
		mocks.$router.currentRoute.name = 'edit';

		const wrapper = shallowMount(TheMap, {
			mocks
		});

		const queueMarkers = wrapper.findAll('mapuploadmarker-stub');

		assert.equal(queueMarkers.length, 2);
	});

	it('doesnt render the queue markers when it has entries and mode isnt edit', () => {
		const wrapper = shallowMount(TheMap, {
			mocks
		});

		const queueMarkers = wrapper.findAll('mapuploadmarker-stub');

		assert.equal(queueMarkers.length, 0);
	});

	it('doesnt render the errored markers it has entries and mode isnt edit', () => {
		const wrapper = shallowMount(TheMap, {
			mocks
		});

		const queueMarkers = wrapper.findAll('mapuploadmarker-stub');

		assert.equal(queueMarkers.length, 0);
	});
});
