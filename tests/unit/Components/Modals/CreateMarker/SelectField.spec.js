import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import SelectField from '@/Components/Modals/CreateMarker/SelectField';

describe('CreateMarker/SelectField.vue', () => {

	it('Renders', () => {
		const wrapper = shallowMount(SelectField, {
			propsData: {
				options: {
					option1: 'option1',
					option2: 'option2'
				},
				name: 'bla'
			}
		});

		assert.isTrue(wrapper.find('select[name=bla]').exists());
		assert.isFalse(wrapper.find('.help.is-danger').exists());
	});

	it('Renders error', () => {
		const wrapper = shallowMount(SelectField, {
			propsData: {
				error: 'Error',
				options: {
					option1: 'option1',
					option2: 'option2'
				}
			},
		});


		assert.isTrue(wrapper.find('.help.is-danger').exists());
		assert.equal(wrapper.find('.help.is-danger').text(), 'Error');

	});


	it('It emits input when value changes', async () => {
		const wrapper = shallowMount(SelectField, {
			propsData: {
				options: {
					option1: 'option1',
					option2: 'option2'
				}
			}
		});

		wrapper.find('select').setValue('option1');

		assert.deepEqual(wrapper.emitted().input[0][0], 'option1');
	});

});
