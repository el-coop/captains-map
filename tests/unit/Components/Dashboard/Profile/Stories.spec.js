import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import Stories from '@/Components/Dashboard/Profile/Stories.vue';
import sinon from 'sinon';
import {createStore} from "vuex";

describe('Stories.vue', () => {

	let mocks;
	let stubs;
	let storeOptions;


	beforeEach(() => {
		storeOptions = {
			modules: {
				User: {
					namespaced: true,
					state: {
						user: {
							username: 'test'
						}
					}
				},
				Profile: {
					namespaced: true,
					state: {
						user: {
							username: 'test',
						},
						stories: [{
							id: 1,
							name: 'story1'
						}, {
							id: 2,
							name: 'story2'
						}]
					},
					mutations:{
						toggle(){}
					}
				}
			}
		};
		mocks = {
			$router: {
				push: sinon.stub()
			}
		};
		stubs = {
			StoryEditModal: true
		};
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Renders with stories when logged out', async () => {
		storeOptions.modules.User.state.user = null;

		const wrapper = mount(Stories, {
			global:{
				plugins:[createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		expect(wrapper.find('.stories').exists()).toBeTruthy();
		expect(wrapper.find('story-edit-modal-stub').exists()).toBeFalsy();
		expect(wrapper.findAll('.story').length).toBe(2);
	});

	it('Renders without stories when logged out', async () => {
		storeOptions.modules.User.state.user = null;

		storeOptions.modules.Profile.state.stories = [];

		const wrapper = mount(Stories, {
			global:{
				plugins:[createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		expect(wrapper.find('.stories').exists()).toBeTruthy();
		expect(wrapper.find('story-edit-modal-stub').exists()).toBeFalsy();
		expect(wrapper.findAll('.story').length).toBe(0);
	});

	it('Renders with stories when not same user', async () => {
		storeOptions.modules.User.state.user = {
			username: 'kla'
		};

		const wrapper = mount(Stories, {
			global:{
				plugins:[createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		expect(wrapper.find('.stories').exists()).toBeTruthy();
		expect(wrapper.find('story-edit-modal-stub').exists()).toBeFalsy();
		expect(wrapper.findAll('.story').length).toBe(2);
	});

	it('Renders without stories when not same user', async () => {
		storeOptions.modules.User.state.user = {
			username: 'kla'
		};
		storeOptions.modules.Profile.state.stories = [];

		const wrapper = mount(Stories, {
			global:{
				plugins:[createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		expect(wrapper.find('.stories').exists()).toBeTruthy();
		expect(wrapper.find('story-edit-modal-stub').exists()).toBeFalsy();
		expect(wrapper.findAll('.story').length).toBe(0);

	});

	it('Renders with stories when can edit', async () => {
		const wrapper = mount(Stories, {
			global:{
				plugins:[createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		expect(wrapper.find('.stories').exists()).toBeTruthy();
		expect(wrapper.find('story-edit-modal-stub').exists()).toBeTruthy();
		expect(wrapper.findAll('.story').length).toBe(3);
	});

	it('Renders without stories when can edit', async () => {
		storeOptions.modules.Profile.state.stories = [];

		const wrapper = mount(Stories, {
			global:{
				plugins:[createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		expect(wrapper.find('.stories').exists()).toBeTruthy();
		expect(wrapper.find('story-edit-modal-stub').exists()).toBeTruthy();
		expect(wrapper.findAll('.story').length).toBe(1);
	});

	it('Opens modal when new is clicked', async () => {
		const wrapper = mount(Stories, {
			global:{
				plugins:[createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		wrapper.find('.story__link').trigger('click');

		await wrapper.vm.$nextTick();

		expect(wrapper.vm.$data.createModal).toBeTruthy();
	});

	it('Triggers routing to story when story is clicked', async () => {
		const profileToggleStub = sinon.stub();
		storeOptions.modules.Profile.mutations.toggle = profileToggleStub;

		const wrapper = mount(Stories, {
			global:{
				plugins:[createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		wrapper.findAll('.story__link').at(1).trigger('click');

		await wrapper.vm.$nextTick();

		expect(profileToggleStub.called).toBeTruthy();
		expect(profileToggleStub.calledWith()).toBeTruthy();
		expect(mocks.$router.push.called).toBeTruthy();
		expect(mocks.$router.push.calledWith('test/story/1')).toBeTruthy();
	});
});
