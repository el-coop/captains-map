import {describe, it, expect} from 'vitest';
import { shallowMount } from '@vue/test-utils';
import SearchLocationField from '@/Components/Modals/CreateMarker/SearchLocationField.vue';
import sinon from "sinon";
import { LeafletMapService } from "@/Services/LeafletMapService";

describe('CreateMarker/SearchLocationField.vue', () => {
	const props = {
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
			props,
			global:{stubs}
		});

		expect(wrapper.find('#location[type=text]').exists()).toBeTruthy();
		expect(wrapper.find('button.is-selected-background').exists()).toBeTruthy();
		expect(wrapper.find('.help.is-danger').exists()).toBeFalsy();
	});

	it('Renders error', () => {
		props.error = 'error';
		const wrapper = shallowMount(SearchLocationField, {
			props,
			global:{stubs}
		});


		expect(wrapper.find('.help.is-danger').exists()).toBeTruthy();
		expect(wrapper.find('.help.is-danger').text()).toBe('error');

	});


	it('It emits input when value changes', async () => {
		const wrapper = shallowMount(SearchLocationField, {
			props,
			global:{stubs}
		});

		wrapper.find('#location[type=text]').setValue('location');
		wrapper.find('#location[type=text]').trigger('change');

		expect(wrapper.emitted()['update:modelValue'][0][0]).toBe('location');
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
			props,
			global:{stubs}
		});

		wrapper.find('button').trigger('click');

		expect(wrapper.vm.$data.searching).toBeTruthy();
		expect(wrapper.vm.$data.searched).toBeFalsy();

		await wrapper.vm.$nextTick();

		expect(wrapper.vm.$data.searching).toBeFalsy();
		expect(wrapper.vm.$data.searched).toBeTruthy();
		expect(geocoderStub.calledOnce).toBeTruthy();
		expect(geocoderStub.calledWith({lat: 0, lng: 0})).toBeTruthy();
		expect(wrapper.vm.results).toEqual(['street, 1 - city, country']);
	});

	it('Renders search result', async () => {
		const wrapper = shallowMount(SearchLocationField, {
			props,
			global:{stubs}
		});

		expect(wrapper.html()).not.toContain('street, 1 - city, country');

		await wrapper.setData({
			searched: true,
			results: [
				'street, 1 - city, country'
			]
		});

		expect(wrapper.html()).toContain('street, 1 - city, country');

	});

	it('Renders no results for empty results', async () => {
		const wrapper = shallowMount(SearchLocationField, {
			props,
			global:{stubs}
		});

		await wrapper.setData({
			searched: true
		});

		expect(wrapper.html()).toContain('Could not find location');

	});

	it('Emits input when clicked', async () => {
		const wrapper = shallowMount(SearchLocationField, {
			props,
			global:{stubs}
		});

		await wrapper.setData({
			searched: true,
			results: [
				'street, 1 - city, country'
			]
		});

		wrapper.find('.dropdown__content-item').trigger('click');

		expect(wrapper.emitted()['update:modelValue'][0][0]).toBe('street, 1 - city, country');
	});

	it('Changes value when prop changes', async () => {
		props.modelValue = 'street, 1 - city, country';
		const wrapper = shallowMount(SearchLocationField, {
			props,
			global:{stubs}
		});

		expect(wrapper.find('#location[type=text]').element.value).toBe('street, 1 - city, country');

		await wrapper.setProps({
			modelValue: 'bla'
		});

		expect(wrapper.find('#location[type=text]').element.value).toBe('bla');

	});
});
