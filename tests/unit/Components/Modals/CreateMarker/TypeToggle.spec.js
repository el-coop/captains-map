import {describe, it, expect} from 'vitest';
import { shallowMount } from '@vue/test-utils';
import TypeToggle from '@/Components/Modals/CreateMarker/TypeToggle.vue';

describe('CreateMarker/TypeToggle.vue', () => {

	const stubs = {
		FontAwesomeIcon: true
	};

	it('Renders', () => {
		const wrapper = shallowMount(TypeToggle, {
			global:{stubs},
			props: {
				modelValue: 'image'
			}
		});

		expect(wrapper.find('input[type=hidden]').exists()).toBeTruthy();
		expect(wrapper.find('input[type=hidden]').exists()).toBeTruthy();
	});


	it('It emits image input when image selected', async () => {
		const wrapper = shallowMount(TypeToggle, {
			global:{stubs},
			props: {
				modelValue: 'image'
			}
		});

		wrapper.findAll('a').at(0).trigger('click');

		expect(wrapper.emitted()['update:modelValue'][0][0]).toBe('image');
	});

	it('It emits instagram input when image selected', async () => {
		const wrapper = shallowMount(TypeToggle, {
			global:{stubs},
			props: {
				modelValue: 'image'
			}
		});

		wrapper.findAll('a').at(1).trigger('click');

		expect(wrapper.emitted()['update:modelValue'][0][0]).toBe('instagram');
	});

});
