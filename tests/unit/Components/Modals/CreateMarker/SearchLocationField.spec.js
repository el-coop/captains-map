import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import SearchLocationField from '@/Components/Modals/CreateMarker/SearchLocationField';
import sinon from "sinon";
import { LeafletMapService } from "@/Services/LeafletMapService";

describe('CreateMarker/SearchLocationField.vue', () => {
	const propsData = {
		latLng: {
			lat: 0,
			lng: 0
		}
	};
	const stubs = {
		FontAwesomeIcon: true
	};
	it('Renders', () => {
		const wrapper = shallowMount(SearchLocationField, {
			propsData,
			stubs
		});

		assert.isTrue(wrapper.find('#location[type=text]').exists());
		assert.isTrue(wrapper.find('button.is-info').exists());
		assert.isFalse(wrapper.find('.help.is-danger').exists());
	});

	it('Renders error', () => {
		propsData.error = 'error';
		const wrapper = shallowMount(SearchLocationField, {
			propsData,
			stubs
		});


		assert.isTrue(wrapper.find('.help.is-danger').exists());
		assert.equal(wrapper.find('.help.is-danger').text(), 'The location is invalid.');

	});


	it('It emits input when value changes', async () => {
		const wrapper = shallowMount(SearchLocationField, {
			propsData,
			stubs
		});

		wrapper.find('#location[type=text]').setValue('location');
		wrapper.find('#location[type=text]').trigger('change');

		assert.deepEqual(wrapper.emitted().input[0][0], 'location');
	});

	it('Reverse geocodes', async () => {
		const geocoderStub = sinon.stub(LeafletMapService, 'reverseGeocode').callsFake(() => {
			return [{
				streetName: 'street',
				streetNumber: '1',
				city: 'city',
				country: 'country'
			}];
		});
		const wrapper = shallowMount(SearchLocationField, {
			propsData,
			stubs
		});

		wrapper.find('button').trigger('click');

		assert.isTrue(wrapper.vm.$data.searching);
		assert.isFalse(wrapper.vm.$data.searched);

		await wrapper.vm.$nextTick();

		assert.isFalse(wrapper.vm.$data.searching);
		assert.isTrue(wrapper.vm.$data.searched);
		assert.isTrue(geocoderStub.calledOnce);
		assert.isTrue(geocoderStub.calledWith({lat: 0, lng: 0}));
		assert.deepEqual(wrapper.vm.results, ['street, 1 - city, country']);
	});

	it('Renders search result', () => {
		const wrapper = shallowMount(SearchLocationField, {
			propsData,
			stubs
		});

		assert.notInclude(wrapper.html(), 'street, 1 - city, country');

		wrapper.setData({
			searched: true,
			results: [
				'street, 1 - city, country'
			]
		});

		assert.include(wrapper.html(), 'street, 1 - city, country');
	});

	it('Renders no results for empty results', () => {
		const wrapper = shallowMount(SearchLocationField, {
			propsData,
			stubs
		});

		wrapper.setData({
			searched: true
		});

		assert.include(wrapper.html(), 'Could not find location');
	});

	it('Fills location when result is clicked', async () => {
		const wrapper = shallowMount(SearchLocationField, {
			propsData,
			stubs
		});

		wrapper.setData({
			searched: true,
			results: [
				'street, 1 - city, country'
			]
		});

		wrapper.find('.dropdown-item').trigger('click');

		await wrapper.vm.$nextTick;

		assert.equal(wrapper.vm.$data.content, 'street, 1 - city, country');
		assert.equal(wrapper.find('#location[type=text]').element.value, 'street, 1 - city, country');
	});
});
