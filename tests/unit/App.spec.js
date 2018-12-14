import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import App from '@/App';

describe('App.vue', () => {
	it('renders', () => {
		const wrapper = shallowMount(App, {
			stubs: {
				'router-view': true
			}
		});

		assert.isTrue(wrapper.find('map-view-stub').exists());
		assert.isTrue(wrapper.find('not-found-stub').exists());
		assert.isTrue(wrapper.find('router-view-stub').exists());

	});
});
