import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import TypeToggle from '@/Components/Modals/CreateMarker/TypeToggle';

describe('CreateMarker/TypeToggle.vue', () => {

	const stubs = {
		'font-awesome-icon': true
	};

	it('Renders', () => {
		const wrapper = shallowMount(TypeToggle, {
			stubs,
			propsData: {
				value: 'image'
			}
		});

		assert.isTrue(wrapper.find('input[type=hidden]').exists());
		assert.isTrue(wrapper.find('input[type=hidden]').exists());
	});


	it('It emits image input when image selected', async () => {
		const wrapper = shallowMount(TypeToggle, {
			stubs,
			propsData: {
				value: 'image'
			}
		});

		wrapper.findAll('a').at(0).trigger('click');

		assert.deepEqual(wrapper.emitted().input[0][0], 'image');
	});

	it('It emits instagram input when image selected', async () => {
		const wrapper = shallowMount(TypeToggle, {
			stubs,
			propsData: {
				value: 'image'
			}
		});

		wrapper.findAll('a').at(1).trigger('click');

		assert.deepEqual(wrapper.emitted().input[0][0], 'instagram');
	});

});
