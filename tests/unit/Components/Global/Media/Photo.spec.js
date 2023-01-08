import {describe, it, expect} from 'vitest';
import { shallowMount } from '@vue/test-utils';
import Photo from '@/Components/Global/Media/Photo.vue';
import sinon from 'sinon';

describe('Photo.vue', () => {

	const stubs = {
		FontAwesomeIcon: true
	};

	it('Renders', () => {
		const wrapper = shallowMount(Photo, {
			global:{
				stubs
			},
			props: {
				path: '/test'
			},
		});

		expect(wrapper.find('img').exists()).toBeTruthy();
		expect(wrapper.find('img').element.src).toBe('http://localhost:3000/api/test');
	});

	it('Opens image in new window when button is clicked', () => {
		global.window.open = sinon.stub();

		const wrapper = shallowMount(Photo, {
			global:{
				stubs
			},
			props: {
				path: '/test'
			},
		});

		wrapper.find('button').trigger('click');

		expect(global.window.open.calledOnce).toBeTruthy();
		expect(global.window.open.calledWith('/api/test')).toBeTruthy();

		delete global.window.open;
	});
});
