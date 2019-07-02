import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import TypeField from '@/Components/Modals/CreateMarker/SelectField';

describe('CreateMarker/TypeField.vue', () => {

	it('Renders', () => {
		const wrapper = shallowMount(TypeField);

		assert.isTrue(wrapper.find('select[name=type]').exists());
		assert.isFalse(wrapper.find('.help.is-danger').exists());
	});

	it('Renders error', () => {
		const wrapper = shallowMount(TypeField, {
			propsData: {
				error: 'Error'
			},
		});


		assert.isTrue(wrapper.find('.help.is-danger').exists());
		assert.equal(wrapper.find('.help.is-danger').text(), 'Invalid marker type.');

	});


	it('It emits input when value changes', async () => {
		const wrapper = shallowMount(TypeField);

		wrapper.find('select[name=type]').setValue('Suggestion');

		assert.deepEqual(wrapper.emitted().input[0][0],'Suggestion');
	});

});
