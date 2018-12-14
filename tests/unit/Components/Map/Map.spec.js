import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Map from '@/Components/Map/Map.vue';
import mapService from '@/Services/LeafletMapService';
import sinon from 'sinon';
const pageSize = parseInt(process.env.VUE_APP_PAGE_SIZE);

describe('Map.vue', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('renders without markers', () => {
		const wrapper = shallowMount(Map, {
			mocks: {
				$store: {
					state: {
						Markers: {
							markers: [],
							page: 0
						}
					}
				}
			}
		});
		assert.isTrue(wrapper.find('.map').exists());
		assert.isFalse(wrapper.find('usermarker-stub').exists());
		assert.isFalse(wrapper.find('mapmarker-stub').exists());
	});

	it('Initiates maps and listeners', () => {
		const mapInitStub = sinon.stub(mapService, 'init');
		const mapOnStub = sinon.stub(mapService, 'on');
		const wrapper = shallowMount(Map, {
			mocks: {
				$store: {
					state: {
						Markers: {
							markers: [],
							page: 0
						}
					}
				}
			}
		});
		assert.isTrue(mapInitStub.calledOnce);
		assert.isTrue(mapInitStub.calledWith(wrapper.vm.$refs.map, wrapper.vm.$props.center, wrapper.vm.$props.zoom));

		assert.isTrue(mapOnStub.calledTwice);
		assert.isTrue(mapOnStub.calledWith('contextmenu', wrapper.vm.rightClick));
		assert.isTrue(mapOnStub.calledWith('zoomend', wrapper.vm.handleZoom));
	});

	it('renders markers', () => {
		const wrapper = shallowMount(Map, {
			mocks: {
				$store: {
					state: {
						Markers: {
							markers: [
								{id:1}, {id:2}, {id:3}
							],
							page: 0
						}
					}
				}
			}
		});
		assert.equal(wrapper.findAll('map-marker-stub').length, 3);
	});

	it('renders second page of markers markers', () => {
		const markers = new Array(pageSize).fill({});
		markers.push({id:1},{id:2},{id:3})
		const wrapper = shallowMount(Map, {
			mocks: {
				$store: {
					state: {
						Markers: {
							markers,
							page: 1
						}
					}
				}
			}
		});
		assert.equal(wrapper.findAll('map-marker-stub').length, 3);
	});

	it('renders userMarker', () => {
		const wrapper = shallowMount(Map, {
			mocks: {
				$store: {
					state: {
						Markers: {
							markers: [],
							userMarker: true,
							page: 0
						}
					}
				}
			}
		});
		assert.isTrue(wrapper.find('user-marker-stub').exists());
	});

	it('reacts to zoom change', () => {
		const wrapper = shallowMount(Map, {
			mocks: {
				$store: {
					state: {
						Markers: {
							markers: [],
							page: 0
						}
					}
				}
			}
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
		const $bus = {
			$emit() {

			}
		};
		const busEmit = sinon.stub($bus, '$emit');
		const wrapper = shallowMount(Map, {
			mocks: {
				$bus,
				$store: {
					state: {
						Markers: {
							markers: [],
							page: 0
						}
					}
				}
			}
		});
		const event = sinon.stub();


		wrapper.vm.rightClick(event);
		assert.isTrue(busEmit.calledOnce);
		assert.isTrue(busEmit.calledWith('map-right-click', {event}));
	});
});
