import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import SearchBar from '@/Components/edit/SearchBar';
import Map, { LeafletMapService } from '@/Services/LeafletMapService';
import sinon from 'sinon';

describe('SearchBar.vue', () => {
	it('renders', () => {
		const wrapper = shallowMount(SearchBar);

		assert.isTrue(wrapper.find('.input.is-rounded').exists());
		assert.isTrue(wrapper.find('.button.is-rounded').exists());
	});

	it('It tracks input', () => {
		const wrapper = shallowMount(SearchBar);
		wrapper.find('.input.is-rounded').element.value = 'a';
		wrapper.find('.input.is-rounded').trigger('input');

		assert.equal(wrapper.vm.query, 'a');
	});

	it('Searches for query value', async () => {
		const geocoderStub = sinon.stub(LeafletMapService, 'locate').callsFake(() => {
			return ['a', 'b'];
		});
		const wrapper = shallowMount(SearchBar);

		wrapper.vm.query = 'test';

		wrapper.find('button').trigger('click');

		assert.isTrue(wrapper.vm.searching);
		assert.isFalse(wrapper.vm.searched);

		await wrapper.vm.$nextTick();

		assert.isFalse(wrapper.vm.searching);
		assert.isTrue(wrapper.vm.searched);
		assert.isTrue(geocoderStub.calledOnce);
		assert.isTrue(geocoderStub.calledWith('test'));
		assert.deepEqual(wrapper.vm.results, ['a', 'b']);
	});

	it('Renders search result', () => {
		const wrapper = shallowMount(SearchBar);

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
		const wrapper = shallowMount(SearchBar);

		assert.notInclude(wrapper.html(), 'test 1');
		assert.notInclude(wrapper.html(), 'test 2');

		wrapper.vm.results = [];
		wrapper.vm.searched = true;

		assert.include(wrapper.html(), 'No results found for');
	});

	it('Moves map when clicking on a result', () => {
		const moveStub = sinon.stub(Map, 'move');
		const wrapper = shallowMount(SearchBar);
		assert.notInclude(wrapper.html(), 'test 1');

		wrapper.vm.results = [
			{
				longitude: 0,
				latitude: 0,
				formattedAddress: "test 1"
			},
		];

		wrapper.find('.dropdown-item').trigger('click');
		assert.isTrue(moveStub.calledWith([0, 0]));
		assert.isTrue(moveStub.calledOnce);
	});
});
