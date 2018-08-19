import { shallowMount } from '@vue/test-utils';
import ViewLayout from '@/views/ViewLayout.vue';
import { assert }  from 'chai';

describe('ViewLayout.vue', () => {
	it('renders', () => {
		const wrapper = shallowMount(ViewLayout);

		assert.isTrue(wrapper.find('.layout').exists());
		assert.isTrue(wrapper.find('viewdashboard-stub').exists());
	});
});
