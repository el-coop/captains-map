import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import { shallowMount } from '@vue/test-utils';
import ProfileOpen from '@/Components/Dashboard/TopBar/ProfileOpen.vue';
import sinon from 'sinon';
import globe from '@/assets/images/globe-icon.png';
import {createStore} from "vuex";


describe('ProfileOpen.vue', () => {

	let stubs;
	let storeOptions;
	let mocks;

	beforeEach(() => {
		storeOptions = {
			modules: {
				Profile: {
					namespaced:true,
					state:{
						user: {
							username: 'test',
							path: '/testpath'
						}
					},
					mutations: {
						toggle(){}
					}
				},
				User: {
					namespaced: true,
					state: {
						user: {}
					}
				},
				Webpush: {
					namespaced:true,
					state:{
						hasPush: true
					}
				},
			}
		};

		stubs = {
			FontAwesomeIcon: true,
			FollowButton: true
		};

		mocks = {
			$router: {
				push: sinon.stub()
			}
		};

	});

	afterEach(() => {
		sinon.restore();
	});


	it('Renders username and logo when they exist and webpush', () => {
		const wrapper = shallowMount(ProfileOpen, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			}
		});

		expect(wrapper.find('img').element.src).toBe('http://localhost:3000/api/testpath');
		expect(wrapper.find('.profile-open__button-text').text()).toBe('test');
		expect(wrapper.find('follow-button-stub').exists()).toBeTruthy();
	});

	it('Renders globe when no image exists', () => {
		storeOptions.modules.Profile.state.user.path = null;
		const wrapper = shallowMount(ProfileOpen, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			}
		});
		expect(wrapper.find('img').element.src).toBe(`http://localhost:3000${globe}`);
		expect(wrapper.find('.profile-open__button-text').text()).toBe('test');
	});

	it('Doesnt have follow button when no push', () => {
		storeOptions.modules.Webpush.state.hasPush = false;
		const wrapper = shallowMount(ProfileOpen, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			}
		});

		expect(wrapper.find('followbutton-stub').exists()).toBeFalsy();
	});

	it('Triggers toggle on store when clicked', async () => {
		const profileToggleStub = sinon.stub();
		storeOptions.modules.Profile.state.user.path = null;
		storeOptions.modules.Profile.mutations.toggle = profileToggleStub;

		const wrapper = shallowMount(ProfileOpen, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			}
		});
		wrapper.find('.profile-open__button').trigger('click');

		await wrapper.vm.$nextTick();

		expect(profileToggleStub.calledOnce).toBeTruthy();
		expect(profileToggleStub.calledWith()).toBeTruthy();
	});


	it('Doesnt show exit profile button when logged in', async () => {

		const wrapper = shallowMount(ProfileOpen, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			}
		});

		expect(wrapper.find('.webpush').exists()).toBeFalsy();

	});

	it('shows exit profile button when logged out, and allows exit', async () => {

		storeOptions.modules.User.state.user = null;

		const wrapper = shallowMount(ProfileOpen, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		wrapper.find('.webpush').trigger('click');

		expect(mocks.$router.push.called).toBeTruthy();
		expect(mocks.$router.push.calledWith('/')).toBeTruthy();


	});

});
