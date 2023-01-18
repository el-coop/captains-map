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
				id: 1
			},

		});

		expect(wrapper.find('h4.title').exists()).toBeTruthy();
		expect($http.get.calledOnce).toBeTruthy();
		expect($http.get.calledWith('marker/instagram/1')).toBeTruthy();

		await wrapper.vm.$nextTick();

		expect(wrapper.vm.$data.embedCode).toBe('html');
		expect(global.instgrm.Embeds.process.calledOnce).toBeTruthy();
	});
});
