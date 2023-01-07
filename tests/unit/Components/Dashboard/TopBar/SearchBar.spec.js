import {describe, it, expect, afterEach} from 'vitest';
import {shallowMount} from '@vue/test-utils';
import SearchBar from '@/Components/Dashboard/TopBar/SearchBar.vue';
import Map, {LeafletMapService} from '@/Services/LeafletMapService';
import http from '@/Services/HttpService';
import sinon from 'sinon';


describe('SearchBar.vue', () => {

	const stubs = {
		FontAwesomeIcon: true
	};

	afterEach(() => {
		sinon.restore();
	});

	it('Renders', () => {
		const wrapper = shallowMount(SearchBar, {
			global: {
				stubs
			}
		});

		expect(wrapper.find('.input.addon-row__control').exists()).toBeTruthy();
		expect(wrapper.find('.button.is-light-background').exists()).toBeTruthy();
	});

	it('Tracks input', () => {
		const wrapper = shallowMount(SearchBar, {
			global: {
				stubs
			}
		});
		wrapper.find('.input').element.value = 'a';
		wrapper.find('.input').trigger('input');

		expect(wrapper.vm.$data.query).toBe('a');
	});

	it('Changes search category to address', async () => {
		const wrapper = shallowMount(SearchBar, {
			global: {
				stubs
			}
		});

		await wrapper.setData({
			searchCategory: 'Users'
		});

		wrapper.find('.dropdown__content-item').trigger('click');

		await wrapper.vm.$nextTick();

		expect(wrapper.vm.$data.searchCategory).toBe('Address');
	});

	it('Changes search category to users', async () => {
		const wrapper = shallowMount(SearchBar, {
			global: {
				stubs
			}
		});

		await wrapper.setData({
			searchCategory: 'Address'
		});

		wrapper.find('.dropdown__content-item').trigger('click');

		await wrapper.vm.$nextTick();

		expect(wrapper.vm.$data.searchCategory).toBe('Users');
	});

	it('Searches for query value location', async () => {
		sinon.stub(Map, 'getCurrentLocation').returns({
			_southWest: {lat: -1, lng: -1},
			_northEast: {lat: 1, lng: 1}
		});
		const geocoderStub = sinon.stub(LeafletMapService, 'locate').callsFake(() => {
			return ['a', 'b'];
		});
		const searchUserStub = sinon.stub(http, 'get');
		const wrapper = shallowMount(SearchBar, {
			global: {
				stubs
			}
		});

		await wrapper.setData({
			query: 'test',
			searchCategory: 'Address'
		});

		wrapper.findAll('button').at(1).trigger('click');

		await wrapper.vm.$nextTick();

		expect(wrapper.vm.$data.searching).toBeTruthy();
		expect(wrapper.vm.$data.searched).toBeFalsy();

		await wrapper.vm.$nextTick();

		expect(wrapper.vm.$data.searching).toBeFalsy();
		expect(wrapper.vm.$data.searched).toBeTruthy();
		expect(geocoderStub.calledOnce).toBeTruthy();
		expect(geocoderStub.calledWith('test', {
			_southWest: {lat: -1, lng: -1},
			_northEast: {lat: 1, lng: 1}
		})).toBeTruthy();
		expect(searchUserStub.called).toBeFalsy();
		expect(wrapper.vm.results).toEqual(['a', 'b']);
	});

	it('Searches for query value users', async () => {
		const geocoderStub = sinon.stub(LeafletMapService, 'locate');
		const searchUserStub = sinon.stub(http, 'get').returns({
			status: 200,
			data: [
				'test'
			]
		});
		const wrapper = shallowMount(SearchBar, {
			global: {
				stubs,
				mocks: {
					$http: http
				}
			}
		});

		await wrapper.setData({
			query: 'test',
			searchCategory: 'Users'
		});

		wrapper.findAll('button').at(1).trigger('click');

		await wrapper.vm.$nextTick();

		expect(wrapper.vm.$data.searching).toBeTruthy();
		expect(wrapper.vm.$data.searched).toBeFalsy();

		await wrapper.vm.$nextTick();

		expect(wrapper.vm.$data.searching).toBeFalsy();
		expect(wrapper.vm.$data.searched).toBeTruthy();
		expect(searchUserStub.calledOnce).toBeTruthy();
		expect(searchUserStub.calledWith('search/users/test')).toBeTruthy();
		expect(geocoderStub.called).toBeFalsy();
		expect(wrapper.vm.$data.results).toEqual(['test']);
	});

	it('Renders search result', async () => {
		const wrapper = shallowMount(SearchBar, {
			global: {
				stubs,
			}
		});

		expect(wrapper.html()).not.toContain('test 1');
		expect(wrapper.html()).not.toContain('test 2');

		wrapper.vm.results = [
			{
				formattedAddress: "test 1"
			},
			{
				formattedAddress: "test 2"
			},
		];

		await wrapper.vm.$nextTick();

		expect(wrapper.html()).toContain('test 1');
		expect(wrapper.html()).toContain('test 2');
	});

	it('Renders no results for empty results', async () => {
		const wrapper = shallowMount(SearchBar, {
			global: {
				stubs,
			}
		});

		expect(wrapper.html(), 'test 1').not.toContain();
		expect(wrapper.html(), 'test 2').not.toContain();

		wrapper.vm.results = [];
		wrapper.vm.searched = true;

		await wrapper.vm.$nextTick();

		expect(wrapper.html()).toContain( 'No results found for');

	});

	it('Moves map when clicking on a address result',async () => {
		const moveStub = sinon.stub(Map, 'move');
		const wrapper = shallowMount(SearchBar, {
			global: {
				stubs,
			}
		});


		await wrapper.setData({
			searchCategory: 'Address',
			results: [{
				longitude: 0,
				latitude: 0,
				formattedAddress: "test 1"
			}]
		});

		wrapper.findAll('.dropdown__content-item').at(1).trigger('click');

		await wrapper.vm.$nextTick();

		expect(moveStub.calledWith([0, 0])).toBeTruthy();
		expect(moveStub.calledOnce).toBeTruthy();
	});

	it('Loads user when clicking on user search results', async () => {
		const moveStub = sinon.stub(Map, 'move');
		const routeSpy = sinon.spy();
		const wrapper = shallowMount(SearchBar, {
			global: {
				stubs,
				mocks: {
					$router: {
						push: routeSpy
					}
				}
			}
		});

		await wrapper.setData({
			searchCategory: 'Users',
			results: ['test']
		});

		wrapper.findAll('.dropdown__content-item').at(1).trigger('click');

		await wrapper.vm.$nextTick();

		expect(routeSpy.calledWith('test')).toBeTruthy();
		expect(moveStub.called).toBeFalsy();
	});

	it('Toggles dropdown on hen hover over search button', async () => {
		const wrapper = shallowMount(SearchBar, {
			global: {
				stubs,
			}
		});

		wrapper.findAll('button').at('1').trigger('mouseenter');

		await wrapper.vm.$nextTick();

		expect(wrapper.find('.dropdown.is-active').exists()).toBeTruthy();
	});

	it('Toggles dropdown off when hover over search button', async () => {
		const wrapper = shallowMount(SearchBar, {
			global: {
				stubs,
			}
		});

		await wrapper.setData({
			openResults: true
		});


		wrapper.findAll('button').at('1').trigger('mouseleave');

		await wrapper.vm.$nextTick();

		expect(wrapper.find('.dropdown.is-active').exists()).toBeFalsy();
	});
});
