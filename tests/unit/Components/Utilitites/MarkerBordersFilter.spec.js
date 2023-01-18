import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import { shallowMount } from '@vue/test-utils';
import MarkerBordersFilter from '@/Components/Utilities/MarkerBordersFilter.vue';
import map from '@/Services/LeafletMapService';
import sinon from 'sinon';
import {createStore} from "vuex";


describe('MarkerBordersFilter.vue', () => {

	let mapOnStub;

	const stubs = {
		FontAwesomeIcon: true
	};
	let storeOptions;

	beforeEach(() => {
		storeOptions = {
			modules: {
				Markers: {
					namespaced: true,
					state: {
						markers: [{
							lat: 0,
							lng: 0
						}]
					},
					mutations: {
						setBorders(){}
					},
					actions: {
						load(){}
					}
				}
			}
		};
		mapOnStub = sinon.stub(map,'on');
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Renders', () => {
		const wrapper = shallowMount(MarkerBordersFilter, {
			global: {
				stubs
			}
		});

		expect(wrapper.findAll('button').length).toBe(3);
		expect(wrapper.find('button[disabled]').exists()).toBeTruthy();
	});

	it('Toggles filters on and off',async () => {
		const wrapper = shallowMount(MarkerBordersFilter, {
			global: {
				stubs
			}
		});

		expect(wrapper.vm.$data.open).toBeFalsy();
		expect(wrapper.find('.marker-border-filter--open').exists()).toBeFalsy();
		wrapper.find('.marker-border-filter__open').trigger('click');
		await wrapper.vm.$nextTick();
		expect(wrapper.vm.$data.open).toBeTruthy();
		expect(wrapper.find('.marker-border-filter--open').exists()).toBeTruthy();
		wrapper.find('.marker-border-filter__open').trigger('click');
		await wrapper.vm.$nextTick();
		expect(wrapper.vm.$data.open).toBeFalsy();
		expect(wrapper.find('.marker-border-filter--open').exists()).toBeFalsy();
	});

	it('Listens for map move end', () => {
		shallowMount(MarkerBordersFilter, {
			global: {
				stubs
			}
		});

		expect(mapOnStub.calledOnce).toBeTruthy();
		expect(mapOnStub.calledWith('moveend')).toBeTruthy();
	});


	it('Searches only in specific map bounds', async () => {
		sinon.stub(map, 'getBorders').returns({
			_southWest: {
				lat: 0,
				lng: 0
			},
			_northEast: {
				lat: 1,
				lng: 1
			}
		});
		const setBordersStub = sinon.stub();
		storeOptions.modules.Markers.mutations.setBorders = setBordersStub;
		const loadStub = sinon.stub();
		storeOptions.modules.Markers.actions.load = loadStub;
		const wrapper = shallowMount(MarkerBordersFilter, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			},
		});

		wrapper.findAll('button').at(1).trigger('click');

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(setBordersStub.calledOnce).toBeTruthy();
		expect(setBordersStub.calledWith(sinon.match.any, [{
			lat: 0,
			lng: 0
		}, {
			lat: 1,
			lng: 1
		}])).toBeTruthy();
		expect(loadStub.calledOnce).toBeTruthy();
		expect(loadStub.calledWith()).toBeTruthy();
		expect(wrapper.vm.$data.location).toBe('current');
		expect(wrapper.find('button[disabled]').text()).toBe('Only Here');
		expect(wrapper.findAll('button[disabled]').length).toBe(1);
	});

	it('Clears search boundaries', async () => {
		const mapSetViewStub = sinon.stub(map, 'setView');
		const setBordersStub = sinon.stub();
		storeOptions.modules.Markers.mutations.setBorders = setBordersStub;
		const loadStub = sinon.stub();
		storeOptions.modules.Markers.actions.load = loadStub;

		const wrapper = shallowMount(MarkerBordersFilter, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			},
		});

		await wrapper.setData({
			location: 'current'
		});

		wrapper.findAll('button').at(2).trigger('click');
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});
		expect(setBordersStub.calledOnce).toBeTruthy();
		expect(setBordersStub.calledWith(sinon.match.any, false)).toBeTruthy();
		expect(loadStub.calledOnce).toBeTruthy();
		expect(loadStub.calledWith()).toBeTruthy();
		expect(wrapper.vm.$data.location).toBe('everywhere');
		expect(mapSetViewStub.calledOnce).toBeTruthy();
		expect(mapSetViewStub.calledWith([0, 0], 16)).toBeTruthy();
		expect(wrapper.find('button[disabled]').text()).toBe('Everywhere');
		expect(wrapper.findAll('button[disabled]').length).toBe(1);
	});

	it('Sets location when map moved and state not equal everywhere', async () => {
		const wrapper = shallowMount(MarkerBordersFilter, {
			global: {
				stubs
			}
		});
		await wrapper.setData({
			location: 'current'
		});

		wrapper.vm.onMoveEnd();

		expect(wrapper.vm.$data.location).toBe('changed');
	});

	it('Doesnt Set location when map moved and state equals everywhere', () => {
		const wrapper = shallowMount(MarkerBordersFilter, {
			global: {
				stubs
			}
		});

		wrapper.vm.onMoveEnd();

		expect(wrapper.vm.$data.location).toBe('everywhere');
	});

});
