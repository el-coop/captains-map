import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Map from '@/components/map/Map.vue';
import mapService from '@/services/leaflet.service';
import sinon from 'sinon';

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
							markers: []
						}
					}
				}
			}
		});
		assert.isTrue(wrapper.find('.map').exists());
		assert.isTrue(wrapper.find('usermarker-stub').exists());
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
							markers: {}
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
								{}, {}, {}
							]
						}
					}
				}
			}
		});
		assert.equal(wrapper.findAll('mapmarker-stub').length, 3);
	});

	it('reacts to zoom change', () => {
		const wrapper = shallowMount(Map, {
			mocks: {
				$store: {
					state: {
						Markers: {
							markers: []
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
							markers: []
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
