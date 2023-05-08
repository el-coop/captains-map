import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import {shallowMount} from '@vue/test-utils';
import Istangram from '@/Components/Global/Media/Instagram.vue';
import sinon from "sinon";


describe('Instagram.vue', () => {

	beforeEach(() => {
		global.instgrm = {
			Embeds: {
				process: sinon.spy()
			}
		};
	});

	afterEach(() => {
		sinon.restore();
		delete global.instgrm;
	});

	it('Renders', async () => {
		const $http = {
			get: sinon.stub().returns({
				data: {
					html: 'html'
				}
			})
		};
		const wrapper = shallowMount(Istangram, {
			global: {
				mocks: {
					$http,
				}
			},
			props: {
				id: 1,
				path: 'bla'
			},

		});

		expect(wrapper.find('img').exists()).toBeTruthy();
		expect(wrapper.find('img').element.src).toBe('http://localhost:3000/api/marker/instagram/p/bla');

	});

	it('Opens instagram in new window when button is clicked', () => {
		global.window.open = sinon.stub();

		const wrapper = shallowMount(Istangram, {
			props: {
				id: 1,
				path: 'bla'
			},

		});

		wrapper.find('button').trigger('click');

		expect(global.window.open.calledOnce).toBeTruthy();
		expect(global.window.open.calledWith('https://www.instagram.com/p/bla/')).toBeTruthy();

		delete global.window.open;
	});
});
