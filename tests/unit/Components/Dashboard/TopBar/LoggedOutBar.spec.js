import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import LoggedOutBar from '@/Components/Dashboard/TopBar/LoggedOutBar.vue';
import sinon from 'sinon';
import {createStore} from "vuex";

describe('LoggedOutBar.vue', () => {

	const stubs = {
		FontAwesomeIcon: true,
		LoginModal: true,
		RegisterModal: true,
	};
	let storeOptions;

	beforeEach(() => {
		storeOptions = {
			modules: {
				Markers: {
					namespaced: true,
					state: {
						username: false
					}
				},
				Stories: {
					namespaced: true,
					state: {
						story: null
					}
				},
			}
		};
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Renders login and register', () => {
		const wrapper = mount(LoggedOutBar, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
			}
		});

		expect(wrapper.find('.top-bar').exists()).toBeTruthy();
		expect(wrapper.find('login-modal-stub').exists()).toBeTruthy();
		expect(wrapper.find('register-modal-stub').exists()).toBeTruthy();
		expect(wrapper.findAll('button').at(0).text()).toBe('Log In');
		expect(wrapper.findAll('button').at(1).text()).toBe('Register');
	});

	it('Starts login modal when log in clicked', async () => {
		const wrapper = mount(LoggedOutBar, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
			}
		});

		await wrapper.setData({
			loginModal: false
		});

		wrapper.findAll('.button').at(0).trigger('click');

		await wrapper.vm.$nextTick();

		expect(wrapper.vm.$data.loginModal).toBeTruthy();
	});

	it('Calls register modal when register in clicked',async () => {
		const wrapper = mount(LoggedOutBar, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
			}
		});

		await wrapper.setData({
			registerModal: false
		});

		wrapper.findAll('.button').at(1).trigger('click');

		await wrapper.vm.$nextTick();

		expect(wrapper.vm.$data.registerModal).toBeTruthy();

	});
});
