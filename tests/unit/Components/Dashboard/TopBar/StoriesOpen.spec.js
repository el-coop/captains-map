import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import {shallowMount} from '@vue/test-utils';
import StoriesOpen from '@/Components/Dashboard/TopBar/StoriesOpen.vue';
import sinon from 'sinon';
import {createStore} from "vuex";


describe('StoriesOpen.vue', () => {

	let mocks;
	let stubs;
	let storeOptions;

	beforeEach(() => {
		storeOptions = {
			modules: {
				Stories: {
					namespaced:true,
					state:{
						story: {
							name: 'story1'
						}
					}
				},
				User: {
					namespaced:true,
					state:{
						user: {
							username: 'username'
						}
					}
				},
				Profile: {
					namespaced: true,
					mutations: {
						trackStory(){}
					}
				}
			}
		};
		mocks = {
			$toast: {
				success: sinon.stub()
			},
			$route: {
				params: {
					username: 'username'
				}
			},
			$router: {
				push: sinon.stub()
			}
		};

		stubs = {
			FontAwesomeIcon: true,
			StoryEditModal: true
		};
	});

	afterEach(() => {
		sinon.restore();
	});


	it('Renders in non edit mode when no logged in user', () => {
		storeOptions.modules.User.state.user = null;

		const wrapper = shallowMount(StoriesOpen, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks,
				stubs
			}
		});

		expect(wrapper.text()).toContain('story1');
		expect(wrapper.find('story-edit-modal-stub').exists()).toBeFalsy();
		expect(wrapper.find('.profile-open').exists()).toBeTruthy();
	});

	it('Renders in non edit mode when logged in user not story owner', () => {
		storeOptions.modules.User.state.user = {
			username: 'test'
		};

		const wrapper = shallowMount(StoriesOpen, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks,
				stubs
			}
		});


		expect(wrapper.text()).toContain('story1');
		expect(wrapper.find('story-edit-modal-stub').exists()).toBeFalsy();
		expect(wrapper.find('.profile-open').exists()).toBeTruthy();
	});

	it('Renders in edit mode when username matches user logged in user', () => {
		const wrapper = shallowMount(StoriesOpen, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks,
				stubs
			}
		});

		expect(wrapper.text()).toContain('story1');
		expect(wrapper.find('story-edit-modal-stub').exists()).toBeTruthy();
		expect(wrapper.find('.profile-open').exists()).toBeTruthy();
	});

	it('Exists story when exit clicked', () => {
		const trackStoryStub = sinon.stub();
		storeOptions.modules.Profile.mutations.trackStory = trackStoryStub;

		const wrapper = shallowMount(StoriesOpen, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks,
				stubs
			}
		});

		wrapper.find('button.webpush').trigger('click');


		expect(trackStoryStub.calledOnce).toBeTruthy();
		expect(trackStoryStub.calledWith(sinon.match.any,storeOptions.modules.Stories.state.story)).toBeTruthy();

		expect(mocks.$router.push.calledOnce).toBeTruthy();
		expect(mocks.$router.push.calledWith('/username')).toBeTruthy();
	});

	it('Opens edit modal when edit is clicked', () => {
		const wrapper = shallowMount(StoriesOpen, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks,
				stubs
			}
		});

		wrapper.find('button.profile-open__button').trigger('click');

		expect(wrapper.vm.$data.edit).toBeTruthy();
	});

	it('Closes edit modal when signled from modal', () => {
		const wrapper = shallowMount(StoriesOpen, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks,
				stubs
			}
		});

		wrapper.find('story-edit-modal-stub').trigger('saved');

		expect(wrapper.vm.$data.edit).toBeFalsy();
	});
});
