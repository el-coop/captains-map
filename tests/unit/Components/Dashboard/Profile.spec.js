import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import {shallowMount} from '@vue/test-utils';
import Profile from '@/Components/Dashboard/Profile.vue';
import sinon from 'sinon';
import {createStore} from "vuex";

describe('Profile.vue', () => {

	let mocks;
	let stubs;
	let storeOptions;

	beforeEach(() => {
		storeOptions = {
			modules: {
				Profile: {
					namespaced: true,
					state: {
						user: {
							username: 'test',
							description: 'description',
							path: false
						}
					},
					mutations: {
						toggle(){}
					}
				},
				User: {
					namespaced: true,
					state: {
						user: null

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
			$http: {},
			$toast: {
				success: sinon.stub(),
				error: sinon.stub()
			}
		};
		stubs = {
			FontAwesomeIcon: true,
			Stories: true
		};
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Renders', async () => {
		const wrapper = shallowMount(Profile, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			},
		});

		expect(wrapper.find('.dashboard__control.profile').exists()).toBeTruthy();
		expect(wrapper.find('stories-stub').exists()).toBeTruthy();
		expect(wrapper.find('.title.is-4').text()).toBe('test');
	});

	it('Toggles open', async () => {
		storeOptions.modules.Profile.state.open = true;

		const wrapper = shallowMount(Profile, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			},
		});

		expect(wrapper.find('.dashboard__control.profile.profile--open').exists()).toBeTruthy();
	});

	it('Closes when clicked', async () => {
		const profileToggleStub = sinon.stub();
		storeOptions.modules.Profile.state.open = true;
		storeOptions.modules.Profile.mutations.toggle = profileToggleStub;

		const wrapper = shallowMount(Profile, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			},
		});

		wrapper.find('.icon.profile__close').trigger('click');

		await wrapper.vm.$nextTick();

		expect(profileToggleStub.calledOnce).toBeTruthy();
		expect(profileToggleStub.calledWith()).toBeTruthy();
	});

	it('Doesnt open when a story is chosen', async () => {
		storeOptions.modules.Profile.state.open = true;
		storeOptions.modules.Stories.state.story = 1;

		const wrapper = shallowMount(Profile, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			},
		});

		expect(wrapper.find('.dashboard__control.profile.profile--open').exists()).toBeFalsy();
	});

});
