import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import TextField from '@/Components/Modals/CreateMarker/TextField';

describe('CreateMarker/TextField.vue', () => {

	it('Renders', () => {
		const wrapper = shallowMount(TextField);

		assert.isTrue(wrapper.find('input[type=text]').exists());
		assert.isFalse(wrapper.find('.help.is-danger').exists());
		assert.isFalse(wrapper.find('.label').exists());
		assert.isFalse(wrapper.find('input[placeholder=placeholder]').exists());
	});

	it('Sets type', () => {
		const wrapper = shallowMount(TextField, {
			propsData: {
				type: 'password'
			}
		});

		assert.isFalse(wrapper.find('input[type=text]').exists());
		assert.isTrue(wrapper.find('input[type=password]').exists());
	});

	it('Sets placeholder', () => {
		const wrapper = shallowMount(TextField, {
			propsData: {
				placeholder: 'placeholder'
			}
		});

		assert.isTrue(wrapper.find('input[placeholder=placeholder]').exists());
	});

	it('Sets label', () => {
		const wrapper = shallowMount(TextField, {
			propsData: {
				label: 'label'
			}
		});
		assert.equal(wrapper.find('.label').text(),'label');

	});

	it('Renders error', () => {
		const wrapper = shallowMount(TextField, {
			propsData: {
				error: 'Error'
			},
		});

		assert.isTrue(wrapper.find('.help.is-danger').exists());
		assert.equal(wrapper.find('.help.is-danger').text(), 'Error');

	});


	it('It emits input when value changes', async () => {
		const wrapper = shallowMount(TextField);

		wrapper.find('input[type=text]').setValue('instagram');
		wrapper.find('input[type=text]').trigger('change');

		assert.deepEqual(wrapper.emitted().input[0][0], 'instagram');
	});

});
