import {describe, it, expect} from 'vitest';
import { shallowMount } from '@vue/test-utils';
import SelectField from '@/Components/Modals/CreateMarker/SelectField.vue';

describe('CreateMarker/SelectField.vue', () => {

	it('Renders', () => {
		const wrapper = shallowMount(SelectField, {
			props: {
				options: {
					option1: 'option1',
					option2: 'option2'
				},
				name: 'bla'
			}
		});

		expect(wrapper.find('select[name=bla]').exists()).toBeTruthy();
		expect(wrapper.find('.help.is-danger').exists()).toBeFalsy();
	});

	it('Renders error', () => {
		const wrapper = shallowMount(SelectField, {
			props: {
				error: 'Error',
				options: {
					option1: 'option1',
					option2: 'option2'
				}
			},
		});


		expect(wrapper.find('.help.is-danger').exists()).toBeTruthy();
		expect(wrapper.find('.help.is-danger').text()).toBe('Error');

	});


	it('It emits input when value changes', async () => {
		const wrapper = shallowMount(SelectField, {
			props: {
				options: {
					option1: 'option1',
					option2: 'option2'
				}
			}
		});

		wrapper.find('select').setValue('option1');

		expect(wrapper.emitted()['update:modelValue'][0][0]).toBe('option1');
	});

});
