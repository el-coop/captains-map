import {describe, it, expect} from 'vitest';
import {shallowMount} from '@vue/test-utils';
import App from '@/App.vue';
import {createStore} from 'vuex'
import sinon from "sinon";

describe('App.vue', () => {
	const stubs = {
		RouterView: true,
		metainfo: true
	};

	const storeOptions = {
		modules: {
			Uploads: {
				namespaced: true,
				actions: {
					init(){},
				}
			},
			actions: {
				initSettings(){},
			}
		},
	};
	const store = createStore(storeOptions);

	it('renders', () => {
		const wrapper = shallowMount(App, {
			global: {
				plugins: [store],
				stubs
			},
		});

		expect(wrapper.find('the-map-stub').exists()).toBeTruthy();
		expect(wrapper.find('not-found-stub').exists()).toBeTruthy();
		expect(wrapper.find('router-view-stub').exists()).toBeTruthy();

	});


	it('adds window online event listener on creation', () => {
		global.window.addEventListener = sinon.stub();

		const wrapper = shallowMount(App, {
			global: {
				plugins: [store],
				stubs
			},
		});

		expect(global.window.addEventListener.calledOnce).toBeTruthy();
		expect(global.window.addEventListener.calledWith('online', wrapper.vm.onlineEvent)).toBeTruthy();
	});

	it('dispatches uploads offline errors when onlineEventCalled', () => {
		const uploadOfflineErrorStub = sinon.stub().returns(true);

		const mockStoreOptions = storeOptions;
		mockStoreOptions.modules.Uploads.actions.uploadOfflineError = uploadOfflineErrorStub;
		const mockStore = createStore(mockStoreOptions);

		const wrapper = shallowMount(App, {
			global: {
				plugins: [mockStore],
				stubs,
			},

		});

		wrapper.vm.onlineEvent();

		expect(uploadOfflineErrorStub.calledOnce).toBeTruthy();

	});


	it('removes window online event listener on destroy', () => {
		global.window.removeEventListener = sinon.stub();

		const wrapper = shallowMount(App, {
			global: {
				plugins: [store],
				stubs
			},
		});

		wrapper.unmount();

		expect(global.window.removeEventListener.calledOnce).toBeTruthy();
		expect(global.window.removeEventListener.calledWith('online', wrapper.vm.onlineEvent)).toBeTruthy();
	});

});
