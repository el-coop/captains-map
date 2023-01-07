import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import { shallowMount } from '@vue/test-utils';
import TheDashboard from '@/Components/Dashboard/TheDashboard.vue';
import sinon from 'sinon';
import {createStore} from "vuex";

describe('TheDashboard.vue', () => {

	let mocks;
	let storeOptions;
	const stubs = {
		FontAwesomeIcon: true,
		ProfileEdit: true
	};

	beforeEach(() => {
		global.window.matchMedia = sinon.stub().returns({
			matches: false
		});
		storeOptions = {
			modules:{
				Markers: {
					namespaced: true,
					state:{
						username: false
					}
				},
				Profile: {
					namespaced: true,
					state:{
						user: null
					}
				},
				User: {
					namespaced: true,
					state:{
						user: null
					}
				},

			}
		};
		mocks = {
			$bus: {
				$on: sinon.spy(),
				$off: sinon.spy()
			},
		}
	});

	afterEach(() => {
		delete global.window.matchMedia;
		sinon.restore();
	});

	it('Renders without create-marker modal', async () => {
		const wrapper = shallowMount(TheDashboard, {
			global:{
				plugins:[createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		expect(wrapper.find('marker-borders-filter-stub').exists()).toBeTruthy();
		expect(wrapper.find('view-marker-stub').exists()).toBeTruthy();
		expect(wrapper.find('marker-list-stub').exists()).toBeTruthy();
	});

	it('Renders logged out bar when no user', () => {
		const wrapper = shallowMount(TheDashboard, {
			global:{
				plugins:[createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		expect(wrapper.find('logged-out-bar-stub').exists()).toBeTruthy();
		expect(wrapper.find('logged-in-bar-stub').exists()).toBeFalsy();
	});


	it('Renders logged in bar when authenticated', () => {

		storeOptions.modules.User.state.user = {};

		const wrapper = shallowMount(TheDashboard, {
			global:{
				plugins:[createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		expect(wrapper.find('logged-out-bar-stub').exists()).toBeFalsy();
		expect(wrapper.find('logged-in-bar-stub').exists()).toBeTruthy();
	});

	it('Toggles profile class when there is a user', () => {
		storeOptions.modules.Markers.state.username = 'test';

		const wrapper = shallowMount(TheDashboard, {
			global:{
				plugins:[createStore(storeOptions)],
				stubs,
				mocks
			}
		});
		expect(wrapper.find('.dashboard--with-profile').exists()).toBeTruthy();
	});

	it('Toggles profileEdit when profile and logged in user is same', () => {
		storeOptions.modules.Markers.state.username = 'test';
		storeOptions.modules.Profile.state.user = {
			username: 'test'
		};
		storeOptions.modules.User.state.user = {
			username: 'test'
		};
		const wrapper = shallowMount(TheDashboard, {
			global:{
				plugins:[createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		expect(wrapper.find('profile-edit-stub').exists()).toBeTruthy();
	});

	it('Toggles profileDisplay when profile and logged in user is same', () => {
		storeOptions.modules.Markers.state.username = 'test1';
		storeOptions.modules.Profile.state.user = {
			username: 'test1'
		};
		storeOptions.modules.User.state.user = {
			username: 'test'
		};

		const wrapper = shallowMount(TheDashboard, {
			global:{
				plugins:[createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		expect(wrapper.find('profile-display-stub').exists()).toBeTruthy();
	});

	it('No profile displays shown when no username', () => {
		const wrapper = shallowMount(TheDashboard, {
			global:{
				plugins:[createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		expect(wrapper.find('profile-display-stub').exists()).toBeFalsy();
		expect(wrapper.find('profile-edit-stub').exists()).toBeFalsy();

	});

});
