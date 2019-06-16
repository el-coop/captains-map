import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Istangram from '@/Components/Global/Media/Instagram';
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
			propsData: {
				markerId: 1
			},
			mocks: {
				$http,
			}
		});

		assert.isTrue(wrapper.find('h4.title').exists());
		assert.isTrue($http.get.calledOnce);
		assert.isTrue($http.get.calledWith('marker/instagram/1'));

		await wrapper.vm.$nextTick();

		assert.equal(wrapper.vm.$data.embedCode, 'html');
		assert.isTrue(global.instgrm.Embeds.process.calledOnce);
	});
});
