import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import LoggedInBar from '@/Components/Dashboard/TopBar/LoggedInBar.vue';
import sinon from 'sinon';
import {createStore} from "vuex";

describe('LoggedInBar.vue', () => {

	let mocks;
	let stubs;
	let storeOptions;

	beforeEach(() => {
		stubs = {
			FontAwesomeIcon: true,
			SearchBar: true,
			ProfileOpen: true,
			// DrawerMobile: true,
			logout: true,
		};
		storeOptions = {
			modules: {
				Markers: {
					namespaced: true,
					state: {
						username: false
					}
				},
				User: {
					namespaced: true,
					state: {
						user: {
							username: 'user',
						},
					}
				},
				Stories: {
					namespaced: true,
					state: {
						story: null
					}
				},
			}
		}
		mocks = {
			$router: {
				push: sinon.spy(),
				currentRoute: {
					path: '/'
				}
			},
		};

	});

	afterEach(() => {
		sinon.restore();
	});


	it('Renders with disabled home button in home', () => {
		const wrapper = mount(LoggedInBar, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});
		expect(wrapper.find('.button:disabled > span:last-child').text()).toBe('Home');
		expect(wrapper.find('.top-bar').exists()).toBeTruthy();
		expect(wrapper.find('logout-stub').exists()).toBeTruthy();
		expect(wrapper.find('search-bar-stub').exists()).toBeTruthy();
	});

	it('Changes route when edit button clicked', async () => {

		const wrapper = mount(LoggedInBar, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		wrapper.findAll('.button').at(2).trigger('click');

		await wrapper.vm.$nextTick();

		expect(mocks.$router.push.calledOnce).toBeTruthy();
		expect(mocks.$router.push.calledWith('/edit')).toBeTruthy();
	});


	it('Renders with disabled edit button in edit page', () => {
		mocks.$router.currentRoute.path = "/edit";

		const wrapper = mount(LoggedInBar, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		expect(wrapper.find('.button:disabled > span:last-child').text()).toBe('user');
		expect(wrapper.find('.button').exists()).toBeTruthy();
		expect(wrapper.find('search-bar-stub').exists()).toBeTruthy();
	});

	it('Changes route when home button clicked clicked', async () => {
		storeOptions.modules.Markers.state.username = "test";

		const wrapper = mount(LoggedInBar, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});


		wrapper.findAll('.button').at(3).trigger('click');
		await wrapper.vm.$nextTick();
		expect(mocks.$router.push.calledOnce).toBeTruthy();
		expect(mocks.$router.push.calledWith('/')).toBeTruthy();
	});

});
