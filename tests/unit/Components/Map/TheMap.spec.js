import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import {shallowMount} from '@vue/test-utils';
import TheMap from '@/Components/Map/TheMap.vue';
import mapService from '@/Services/LeafletMapService';
import sinon from 'sinon';
import {createStore} from "vuex";
import leaflet from "leaflet";

const pageSize = parseInt(import.meta.env.VITE_APP_PAGE_SIZE);

describe('TheMap.vue', () => {

	let mocks;
	let mapInitStub;
	let mapOnStub;
	let storeOptions;

	beforeEach(() => {
		mapOnStub = sinon.stub(mapService, 'on');
		storeOptions = {
			modules: {
				User: {
					namespaced: true,
					state: {
						username: 'user'
					}

				},
				Markers: {
					namespaced: true,
					state: {
						markers: [],
						page: 0
					}
				},
				Stories: {
					namespaced: true,
					state: {
						story: null
					}
				},
				Uploads: {
					namespaced: true,
					getters: {
						allFiles() {
							return [{
								uploadTime: 1
							}, {
								uploadTime: 2,
								error: {
									status: 500
								}
							},{
								uploadTime: 3,
								story: 1,
								error: {
									status: 500
								}
							},];
						}
					}
				},
			}
		};
		mocks = {
			$route: {
				name: 'view'
			}
		};

		mapInitStub = sinon.stub(mapService, 'init');
	});

	afterEach(() => {
		sinon.restore();
	});

	it('renders without markers', () => {
		const wrapper = shallowMount(TheMap, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			},
		});
		expect(wrapper.find('.map').exists()).toBeTruthy();
		expect(wrapper.find('user-marker-stub').exists()).toBeFalsy();
		expect(wrapper.find('map-marker-stub').exists()).toBeFalsy();
	});

	it('Initiates maps and listeners', () => {
		const wrapper = shallowMount(TheMap, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			},
		});

		expect(mapInitStub.calledOnce).toBeTruthy();
		expect(mapInitStub.calledWith(wrapper.vm.$refs.map, wrapper.vm.$props.center, wrapper.vm.$props.zoom)).toBeTruthy();

		expect(mapOnStub.calledTwice).toBeTruthy();
		expect(mapOnStub.calledWith('contextmenu', wrapper.vm.rightClick)).toBeTruthy();
		expect(mapOnStub.calledWith('zoomend', wrapper.vm.handleZoom)).toBeTruthy();
	});

	it('renders markers', () => {
		leaflet.markerClusterGroup = sinon.spy();
		storeOptions.modules.Markers.state.markers = [
			{id: 1}, {id: 2}, {id: 3}
		];
		const wrapper = shallowMount(TheMap, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks,
				stubs: {
					MapMarkerCluster: false
				}
			},
		});

		expect(wrapper.findAll('map-marker-stub').length).toBe(3);
	});

	it('renders story markers', () => {
		leaflet.markerClusterGroup = sinon.spy();
		storeOptions.modules.Markers.state.markers = [
			{id: 1}, {id: 2}, {id: 3}
		];

		storeOptions.modules.Markers.state.markers = [
			{id: 4}, {id: 5}, {id: 6}, {id: 7}
		];

		const wrapper = shallowMount(TheMap, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks,
				stubs: {
					MapMarkerCluster: false
				}
			},
		});

		expect(wrapper.findAll('map-marker-stub').length).toBe(4);
	});

	it('renders second page of markers markers', () => {
		leaflet.markerClusterGroup = sinon.spy();
		storeOptions.modules.Markers.state.markers = new Array(pageSize).fill({});
		storeOptions.modules.Markers.state.markers.push({id: 1}, {id: 2}, {id: 3});
		storeOptions.modules.Markers.state.page = 1;
		const wrapper = shallowMount(TheMap, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks,
				stubs: {
					MapMarkerCluster: false
				}
			},
		});
		expect(wrapper.findAll('map-marker-stub').length).toBe(3);
	});

	it('renders userMarker', () => {
		storeOptions.modules.Markers.state.userMarker = true;

		const wrapper = shallowMount(TheMap, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks,
			},
		});
		expect(wrapper.find('map-user-marker-stub').exists()).toBeTruthy();
	});

	it('reacts to zoom change', async () => {
		const wrapper = shallowMount(TheMap, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks,
			},
		});

		wrapper.vm.handleZoom({
			target: {
				_animateToZoom: 4
			}
		});

		await wrapper.vm.$nextTick();

		expect(wrapper.find('.map--zoom-far').exists()).toBeTruthy();

		wrapper.vm.handleZoom({
			target: {
				_animateToZoom: 9
			}
		});

		await wrapper.vm.$nextTick();

		expect(wrapper.find('.map--zoom-medium').exists()).toBeTruthy();

		wrapper.vm.handleZoom({
			target: {
				_animateToZoom: 14
			}
		});
		await wrapper.vm.$nextTick();

		expect(wrapper.find('.map--zoom-normal').exists()).toBeTruthy();


		wrapper.vm.handleZoom({
			target: {
				_animateToZoom: 18
			}
		});
		await wrapper.vm.$nextTick();

		expect(wrapper.find('.map--zoom-close').exists()).toBeTruthy();
	});

	it('reacts to right click event', () => {
		const wrapper = shallowMount(TheMap, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks,
			},
		});

		const event = sinon.stub();

		wrapper.vm.rightClick(event);

		expect(wrapper.emitted()).toHaveProperty('map-create-marker');
		const rightClickEvent = wrapper.emitted('map-create-marker');
		expect(rightClickEvent[0]).toEqual([{event}]);

	});

	it('renders the queue markers when it has entries and mode is edit', () => {
		mocks.$route.name = 'edit';

		const wrapper = shallowMount(TheMap, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks,
			},
		});

		const queueMarkers = wrapper.findAll('map-upload-marker-stub');

		expect(queueMarkers.length).toBe(2);
	});

	it('doesnt render the queue markers when it has entries and mode isnt edit', () => {
		const wrapper = shallowMount(TheMap, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks,
			},
		});

		const queueMarkers = wrapper.findAll('map-upload-marker-stub');

		expect(queueMarkers.length).toBe(0);
	});

	it('Doesnt renders the queue story markers when it has entries and mode is story without the user', () => {
		mocks.$route.name = 'user/story/1';

		const wrapper = shallowMount(TheMap, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks,
			},
		});

		const queueMarkers = wrapper.findAll('map-upload-marker-stub');

		expect(queueMarkers.length).toBe(0);
	});

	it('Renders the queue story markers when it has entries and mode is story with logged in user', async () => {
		mocks.$route.params = {
			username: 'user'
		};
		mocks.$route.currentPath = 'user/story/1'
		storeOptions.modules.Stories.state.story = {
			id: 1
		}
		storeOptions.modules.User.state.user = {
			username: 'user'
		}


		const wrapper = shallowMount(TheMap, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks,
			},
		});

		const queueMarkers = wrapper.findAll('map-upload-marker-stub');

		expect(queueMarkers.length).toBe(1);
	});
});
