import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Photo from '@/Components/Global/Media/Photo';
import sinon from 'sinon';

describe('Photo.vue', () => {

	const stubs = {
		FontAwesomeIcon: true
	};

	it('Renders', () => {
		const wrapper = shallowMount(Photo, {
			propsData: {
				path: '/test'
			},
			stubs
		});

		assert.isTrue(wrapper.find('img').exists());
		assert.equal(wrapper.find('img').element.src, 'http://localhost/api/test');
	});

	it('Opens image in new window when button is clicked', () => {
		global.window.open = sinon.stub();

		const wrapper = shallowMount(Photo, {
			propsData: {
				path: '/test'
			},
			stubs
		});

		wrapper.find('button').trigger('click');

		assert.isTrue(global.window.open.calledOnce);
		assert.isTrue(global.window.open.calledWith('/api/test'));

		delete global.window.open;
	});
});
