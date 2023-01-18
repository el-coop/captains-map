import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import { shallowMount } from '@vue/test-utils';
import FollowButton from '@/Components/Dashboard/TopBar/FollowButton.vue';
import sinon from 'sinon';
import {createStore} from "vuex";


describe('FollowButton.vue', () => {

	let mocks;
	let stubs;
	let storeOptions;

	beforeEach(() => {
		storeOptions = {
			modules: {
				Webpush: {
					namespaced: true,
					state:{
						hasPush: true,
						following: []
					},
					actions: {
						toggleFollow(){}
					}
				}
			}
		}
		mocks = {
			$toast: {
				error: sinon.stub()
			}
		};
		stubs = {
			FontAwesomeIcon: true
		}
	});

	afterEach(() => {
		sinon.restore();
	});


	it('Renders with follow button', () => {
		const wrapper = shallowMount(FollowButton, {
			global:{
				plugins: [createStore(storeOptions)],
				mocks,
				stubs
			},
			props: {
				user: 'test'
			},
		});

		expect(wrapper.find('button.webpush').exists()).toBeTruthy();
		expect(wrapper.find('span').text()).toBe('Follow');
	});

	it('Renders with follow button', () => {
		storeOptions.modules.Webpush.state.following = ['test'];

		const wrapper = shallowMount(FollowButton, {
			global:{
				plugins: [createStore(storeOptions)],
				mocks,
				stubs
			},
			props: {
				user: 'test'
			},
		});


		expect(wrapper.find('button.webpush').exists()).toBeTruthy();
		expect(wrapper.find('span').text()).toBe('Unfollow');
	});

	it('Toggles following on', async () => {
		const toggleFollowStub = sinon.stub().returns(201);
		storeOptions.modules.Webpush.state.following = [];
		storeOptions.modules.Webpush.actions.toggleFollow = toggleFollowStub;

		const wrapper = shallowMount(FollowButton, {
			global:{
				plugins: [createStore(storeOptions)],
				mocks,
				stubs
			},
			props: {
				user: 'test'
			},
		});

		wrapper.find('button').trigger('click');

		await wrapper.vm.$nextTick();

		expect(wrapper.vm.$data.loading).toBeTruthy();

		await wrapper.vm.$nextTick();

		expect(wrapper.vm.$data.loading).toBeFalsy();
		expect(wrapper.vm.$data.following).toBeTruthy();
		expect(toggleFollowStub.calledOnce).toBeTruthy();
		expect(toggleFollowStub.calledWith(sinon.match.any,'test')).toBeTruthy();

	});

	it('Toggles following off', async () => {
		const toggleFollowStub = sinon.stub().returns(200);
		storeOptions.modules.Webpush.state.following = ['test'];
		storeOptions.modules.Webpush.actions.toggleFollow = toggleFollowStub;

		const wrapper = shallowMount(FollowButton, {
			global:{
				plugins: [createStore(storeOptions)],
				mocks,
				stubs
			},
			props: {
				user: 'test'
			},
		});

		wrapper.find('button').trigger('click');

		await wrapper.vm.$nextTick();

		expect(wrapper.vm.$data.loading).toBeTruthy();

		await wrapper.vm.$nextTick();

		expect(wrapper.vm.$data.loading).toBeFalsy();
		expect(wrapper.vm.$data.following).toBeFalsy();
		expect(toggleFollowStub.calledOnce).toBeTruthy();
		expect(toggleFollowStub.calledWith(sinon.match.any,'test')).toBeTruthy();

	});

	it('Throws error when result is false', async () => {
		const toggleFollowStub = sinon.stub().returns(false);
		storeOptions.modules.Webpush.state.following = [];
		storeOptions.modules.Webpush.actions.toggleFollow = toggleFollowStub;

		const wrapper = shallowMount(FollowButton, {
			global:{
				plugins: [createStore(storeOptions)],
				mocks,
				stubs
			},
			props: {
				user: 'test'
			},
		});

		wrapper.find('button').trigger('click');

		await wrapper.vm.$nextTick();

		expect(wrapper.vm.$data.loading).toBeTruthy();

		await wrapper.vm.$nextTick();

		expect(wrapper.vm.$data.loading).toBeFalsy();
		expect(wrapper.vm.$data.following).toBeFalsy();
		expect(toggleFollowStub.calledOnce).toBeTruthy();
		expect(toggleFollowStub.calledWith(sinon.match.any,'test')).toBeTruthy();
		expect(mocks.$toast.error.calledOnce).toBeTruthy();
		expect(mocks.$toast.error.calledWith('Please try again at a later time', 'Following failed.')).toBeTruthy();


	});
});
