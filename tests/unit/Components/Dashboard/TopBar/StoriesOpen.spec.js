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
		global.navigator.share = false;
		global.navigator.clipboard ={
			writeText: sinon.stub()
		};
		global.window.open = sinon.stub();

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
				success: sinon.stub(),
				info: sinon.stub(),
			},
			$route: {
				params: {
					username: 'username'
				}
			},
			$router: {
				push: sinon.stub(),
				go: sinon.stub()
			}
		};

		stubs = {
			FontAwesomeIcon: true,
			StoryEditModal: true
		};
	});

	afterEach(() => {
		sinon.restore();
		delete global.navigator.share;
		delete global.window.open;
		delete global.navigator.clipboard;

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

	it('Exists story to user when clicked without history', () => {
		delete global.window.history;
		global.window = Object.create(window);
		global.window.history = {
			state: {
				back: null
			}
		}

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

	it('Exists story with -1 when history exists', () => {
		delete global.window.history;
		global.window = Object.create(window);
		global.window.history = {
			state: {
				back: '/edit'
			}
		}

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

		expect(mocks.$router.go.calledOnce).toBeTruthy();
		expect(mocks.$router.go.calledWith(-1)).toBeTruthy();
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

	it('Doesnt show share button when story is unpublished', async () => {
		storeOptions.modules.Stories.state.story = {
			name: 'story1',
			published: 'false'
		};

		const wrapper = shallowMount(StoriesOpen, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks,
				stubs
			}
		});

		expect(wrapper.find('button.webpush.story__bar-button').exists()).toBeFalsy();

	});

	it('Copies links', async () => {
		storeOptions.modules.Stories.state.story = {
			name: 'story1',
			published: 'true'
		};
		const wrapper = shallowMount(StoriesOpen, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks,
				stubs
			}
		});

		wrapper.find('button.webpush.story__bar-button').trigger('click');

		await wrapper.vm.$nextTick();

		expect(global.navigator.clipboard.writeText.calledOnce).toBeTruthy();
		expect(global.navigator.clipboard.writeText.calledWith(window.location.href)).toBeTruthy();
		expect(mocks.$toast.info.calledOnce).toBeTruthy();
		expect(mocks.$toast.info.calledWith('You can paste it anywhere', 'Link copied')).toBeTruthy();
	});


	it('Uses navigator share', async () => {
		global.navigator.share = sinon.stub();
		storeOptions.modules.Stories.state.story = {
			name: 'story1',
			published: 'true'
		};
		const wrapper = shallowMount(StoriesOpen, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks,
				stubs
			}
		});

		wrapper.find('button.webpush.story__bar-button').trigger('click');

		await wrapper.vm.$nextTick();

		expect(global.window.open.notCalled).toBeTruthy();
		expect(global.navigator.share.calledOnce).toBeTruthy();
		expect(global.navigator.share.calledWith({
			title: '',
			text: '',
			url: window.location.href,
		})).toBeTruthy();
	});

	it('Copies link share if navigator share fails', async () => {
		global.navigator.share = sinon.stub().throws();
		storeOptions.modules.Stories.state.story = {
			name: 'story1',
			published: 'true'
		};
		const wrapper = shallowMount(StoriesOpen, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks,
				stubs
			}
		});

		wrapper.find('button.webpush.story__bar-button').trigger('click');

		await wrapper.vm.$nextTick();

		expect(global.navigator.clipboard.writeText.calledOnce).toBeTruthy();
		expect(global.navigator.clipboard.writeText.calledWith(window.location.href)).toBeTruthy();
		expect(mocks.$toast.info.calledOnce).toBeTruthy();
		expect(mocks.$toast.info.calledWith('You can paste it anywhere', 'Link copied')).toBeTruthy();

	});
});
