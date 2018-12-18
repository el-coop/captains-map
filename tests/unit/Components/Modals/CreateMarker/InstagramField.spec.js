import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import InstagramField from '@/Components/Modals/CreateMarker/InstagramField';

describe('CreateMarker/InstagramField.vue', () => {

	it('Renders', () => {
		const wrapper = shallowMount(InstagramField);

		assert.isTrue(wrapper.find('#instagram[type=text]').exists());
		assert.isFalse(wrapper.find('.help.is-danger').exists());
	});

	it('Renders error', () => {
		const wrapper = shallowMount(InstagramField, {
			propsData: {
				error: 'Error'
			},
		});


		assert.isTrue(wrapper.find('.help.is-danger').exists());
		assert.equal(wrapper.find('.help.is-danger').text(), 'You most give a valid instagram link.');

	});


	it('It emits input when value changes', async () => {
		const wrapper = shallowMount(InstagramField);

		wrapper.find('#instagram[type=text]').setValue('instagram');

		assert.deepEqual(wrapper.emitted().input[0][0],'instagram');
	});

});
