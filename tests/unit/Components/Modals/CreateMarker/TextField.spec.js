import {describe, it, expect} from 'vitest';
import { shallowMount } from '@vue/test-utils';
import TextField from '@/Components/Modals/CreateMarker/TextField.vue';

describe('CreateMarker/TextField.vue', () => {

	it('Renders', () => {
		const wrapper = shallowMount(TextField);

		expect(wrapper.find('input[type=text]').exists()).toBeTruthy();
		expect(wrapper.find('.help.is-danger').exists()).toBeFalsy();
		expect(wrapper.find('.label').exists()).toBeFalsy();
		expect(wrapper.find('input[placeholder=placeholder]').exists()).toBeFalsy();
	});

	it('Sets type', () => {
		const wrapper = shallowMount(TextField, {
			props: {
				type: 'password'
			}
		});

		expect(wrapper.find('input[type=text]').exists()).toBeFalsy();
		expect(wrapper.find('input[type=password]').exists()).toBeTruthy();
	});

	it('Sets placeholder', () => {
		const wrapper = shallowMount(TextField, {
			props: {
				placeholder: 'placeholder'
			}
		});

		expect(wrapper.find('input[placeholder=placeholder]').exists()).toBeTruthy();
	});

	it('Sets label', () => {
		const wrapper = shallowMount(TextField, {
			props: {
				label: 'label'
			}
		});
		expect(wrapper.find('.label').text()).toBe('label');

	});

	it('Renders error', () => {
		const wrapper = shallowMount(TextField, {
			props: {
				error: 'Error'
			},
		});

		expect(wrapper.find('.help.is-danger').exists()).toBeTruthy();
		expect(wrapper.find('.help.is-danger').text()).toBe('Error');

	});


	it('It emits input when value changes', async () => {
		const wrapper = shallowMount(TextField);

		wrapper.find('input[type=text]').setValue('instagram');
		wrapper.find('input[type=text]').trigger('change');

		expect(wrapper.emitted()['update:modelValue'][0][0]).toBe('instagram');
	});

});
