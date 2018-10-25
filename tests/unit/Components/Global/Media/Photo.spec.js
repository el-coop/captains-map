import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Photo from '@/Components/Global/Media/Photo';

describe('Photo.vue', () => {

	it('Renders', () => {
		const wrapper = shallowMount(Photo, {
			propsData: {
				path: '/test'
			}
		});

		assert.isTrue(wrapper.find('img').exists());
		assert.equal(wrapper.find('img').element.src, '/api/test');
	});
});