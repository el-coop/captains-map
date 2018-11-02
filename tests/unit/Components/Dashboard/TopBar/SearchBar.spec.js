import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import SearchBar from '@/Components/Dashboard/TopBar/SearchBar';
import Map, { LeafletMapService } from '@/Services/LeafletMapService';
import http from '@/Services/http.service';
import sinon from 'sinon';


describe('SearchBar.vue', () => {
	afterEach(() => {
		sinon.restore();
	});

	it('Renders', () => {
		const wrapper = shallowMount(SearchBar, {
			stubs: {
				'font-awesome-icon': true
			}
		});

		assert.isTrue(wrapper.find('.input.dropdown-trigger').exists());
		assert.isTrue(wrapper.find('.button').exists());
	});

	it('Tracks input', () => {
		const wrapper = shallowMount(SearchBar, {
			stubs: {
				'font-awesome-icon': true
			}
		});
		wrapper.find('.input.dropdown-trigger').element.value = 'a';
		wrapper.find('.input.dropdown-trigger').trigger('input');

		assert.equal(wrapper.vm.$data.query, 'a');
	});

	it('Changes search category to address', () => {
		const wrapper = shallowMount(SearchBar, {
			stubs: {
				'font-awesome-icon': true
			}
		});

		wrapper.setData({
			searchCategory: 'Users'
		});

		wrapper.find('.dropdown-item').trigger('click');

		assert.equal(wrapper.vm.$data.searchCategory, 'Address');
	});

	it('Changes search category to users', () => {
		const wrapper = shallowMount(SearchBar, {
			stubs: {
				'font-awesome-icon': true
			}
		});

		wrapper.setData({
			searchCategory: 'Address'
		});

		wrapper.find('.dropdown-item').trigger('click');

		assert.equal(wrapper.vm.$data.searchCategory, 'Users');
	});

	it('Searches for query value location', async () => {
		const geocoderStub = sinon.stub(LeafletMapService, 'locate').callsFake(() => {
			return ['a', 'b'];
		});
		const searchUserStub = sinon.stub(http, 'get');
		const wrapper = shallowMount(SearchBar, {
			stubs: {
				'font-awesome-icon': true
			}
		});

		wrapper.setData({
			query: 'test',
			searchCategory: 'Address'
		});

		wrapper.findAll('button').at(1).trigger('click');

		assert.isTrue(wrapper.vm.$data.searching);
		assert.isFalse(wrapper.vm.$data.searched);

		await wrapper.vm.$nextTick();

		assert.isFalse(wrapper.vm.$data.searching);
		assert.isTrue(wrapper.vm.$data.searched);
		assert.isTrue(geocoderStub.calledOnce);
		assert.isTrue(geocoderStub.calledWith('test'));
		assert.isFalse(searchUserStub.called);
		assert.deepEqual(wrapper.vm.results, ['a', 'b']);
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
			stubs: {
				'font-awesome-icon': true
			},
			mocks: {
				$http: http
			}
		});

		wrapper.setData({
			query: 'test',
			searchCategory: 'Users'
		});

		wrapper.findAll('button').at(1).trigger('click');

		assert.isTrue(wrapper.vm.$data.searching);
		assert.isFalse(wrapper.vm.$data.searched);

		await wrapper.vm.$nextTick();

		assert.isFalse(wrapper.vm.$data.searching);
		assert.isTrue(wrapper.vm.$data.searched);
		assert.isTrue(searchUserStub.calledOnce);
		assert.isTrue(searchUserStub.calledWith('search/users/test'));
		assert.isFalse(geocoderStub.called);
		assert.deepEqual(wrapper.vm.$data.results, ['test']);
	});

	it('Renders search result', () => {
		const wrapper = shallowMount(SearchBar, {
			stubs: {
				'font-awesome-icon': true
			}
		});

		assert.notInclude(wrapper.html(), 'test 1');
		assert.notInclude(wrapper.html(), 'test 2');

		wrapper.vm.results = [
			{
				formattedAddress: "test 1"
			},
			{
				formattedAddress: "test 2"
			},
		];

		assert.include(wrapper.html(), 'test 1');
		assert.include(wrapper.html(), 'test 2');
	});

	it('Renders no results for empty results', () => {
		const wrapper = shallowMount(SearchBar, {
			stubs: {
				'font-awesome-icon': true
			}
		});

		assert.notInclude(wrapper.html(), 'test 1');
		assert.notInclude(wrapper.html(), 'test 2');

		wrapper.vm.results = [];
		wrapper.vm.searched = true;

		assert.include(wrapper.html(), 'No results found for');
	});

	it('Moves map when clicking on a address result', () => {
		const moveStub = sinon.stub(Map, 'move');
		const wrapper = shallowMount(SearchBar, {
			stubs: {
				'font-awesome-icon': true
			}
		});

		wrapper.setData({
			searchCategory: 'Address',
			results: [{
				longitude: 0,
				latitude: 0,
				formattedAddress: "test 1"
			}]
		});

		wrapper.find('.search-field .dropdown-item').trigger('click');
		assert.isTrue(moveStub.calledWith([0, 0]));
		assert.isTrue(moveStub.calledOnce);
	});

	it('Loads user when clicking on user search results', () => {
		const moveStub = sinon.stub(Map, 'move');
		const routeSpy = sinon.spy();
		const wrapper = shallowMount(SearchBar, {
			stubs: {
				'font-awesome-icon': true
			},
			mocks: {
				$router: {
					push: routeSpy
				}
			}
		});

		wrapper.setData({
			searchCategory: 'Users',
			results: ['test']
		});

		wrapper.find('.search-field .dropdown-item').trigger('click');
		assert.isTrue(routeSpy.calledWith('test'));
		assert.isFalse(moveStub.called);
	});

	it('Toggles dropdown on hen hover over search button', () => {
		const wrapper = shallowMount(SearchBar, {
			stubs: {
				'font-awesome-icon': true
			},
		});


		wrapper.findAll('button').at('1').trigger('mouseenter');
		assert.isTrue(wrapper.find('.dropdown.is-active').exists());
	});

	it('Toggles dropdown off when hover over search button', () => {
		const wrapper = shallowMount(SearchBar, {
			stubs: {
				'font-awesome-icon': true
			},
		});

		wrapper.setData({
			openResults: true
		});


		wrapper.findAll('button').at('1').trigger('mouseleave');
		assert.isFalse(wrapper.find('.dropdown.is-active').exists());
	});
});
