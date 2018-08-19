import { shallowMount } from '@vue/test-utils';
import EditLayout from '@/views/EditLayout.vue';
import { assert }  from 'chai';

describe('EditLayout.vue', () => {
	it('renders', () => {
		const wrapper = shallowMount(EditLayout);

		assert.isTrue(wrapper.find('.layout').exists());
		assert.isTrue(wrapper.find('editdashboard-stub').exists());
	});
});
