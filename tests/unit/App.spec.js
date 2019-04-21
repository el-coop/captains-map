import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import App from '@/App';
import sinon from "sinon";

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


	it('adds window online event listener on creation', () => {
		global.window.addEventListener = sinon.stub();

		const wrapper = shallowMount(App, {
			stubs: {
				'router-view': true
			}
		});

		assert.isTrue(global.window.addEventListener.calledOnce);
		assert.isTrue(global.window.addEventListener.calledWith('online', wrapper.vm.onlineEvent));
	});

	it('dispatches uploads offline errors when onlineEventCalled', () => {
		const dispatchStub = sinon.stub().returns(true);

		const wrapper = shallowMount(App, {
			stubs: {
				'router-view': true
			},
			mocks: {
				$store: {
					dispatch: dispatchStub
				}
			}
		});

		wrapper.vm.onlineEvent();


		assert.isTrue(dispatchStub.calledOnce);
		assert.isTrue(dispatchStub.calledWith('Uploads/uploadOfflineError'));

	});


	it('removes window online event listener on destroy', () => {
		global.window.removeEventListener = sinon.stub();

		const wrapper = shallowMount(App, {
			stubs: {
				'router-view': true
			}
		});

		wrapper.destroy();

		assert.isTrue(global.window.removeEventListener.calledOnce);
		assert.isTrue(global.window.removeEventListener.calledWith('online', wrapper.vm.onlineEvent));
	});

});
