import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import {mount} from '@vue/test-utils';
import StoryEditModal from '@/Components/Modals/StoryEditModal.vue';
import BaseModal from "@/Components/Utilities/BaseModal.vue"
import sinon from 'sinon';
import {createStore} from "vuex";

describe('StoryEditModal.vue', () => {
	const stubs = {
		FontAwesomeIcon: true
	};

	const story = {
		user_id: 1,
		name: 'dla',
		published: false,
	};


	let props;
	let mocks;
	let storeOptions;

	beforeEach(() => {
		storeOptions = {
			modules: {
				User:{
					namespaced: true,
					state: {
						user: {
							id: 1
						}
					}
				},
				Stories: {
					namespaced: true,
					actions: {
						save(){}
					},
					mutations: {
						exit(){}
					}
				}
			}
		};
		mocks = {
			$router: {
				push: sinon.spy()
			},
			$toast: {
				error: sinon.stub(),
				success: sinon.stub(),
			},
			$route: {
				params: {
					username: 'username'
				}
			},
		};
		props = {
			active: true,
		};
	});

	afterEach(() => {
		sinon.restore();
	});

	it('renders modal when active', () => {
		const wrapper = mount(StoryEditModal, {
			props,
			global:{
				plugins:[createStore(storeOptions)],
				mocks,
				stubs
			}
		});

		expect(wrapper.find('.modal').exists()).toBeTruthy();
		expect(wrapper.html()).toContain('Choose story name');
		expect(wrapper.find('select').exists()).toBeFalsy();
		expect(wrapper.find('button.is-danger-background').exists()).toBeFalsy();
	});

	it('doesnt render modal when not active', () => {
		const wrapper = mount(StoryEditModal, {
			global:{
				plugins:[createStore(storeOptions)],
				mocks,
				stubs
			}
		});

		expect(wrapper.find('.modal').exists()).toBeTruthy();
		expect(wrapper.html()).not.toContain('Choose story name');
	});

	it('closes modal on click when not editing', () => {
		const wrapper = mount(StoryEditModal, {
			global:{
				plugins:[createStore(storeOptions)],
				mocks,
				stubs
			},
			props,
		});

		wrapper.find('.card__footer-item a').trigger('click');

		expect(wrapper.emitted()['update:active'][0][0]).toBeFalsy();
	});

	it('closes modal when emitted form modal', () => {
		const wrapper = mount(StoryEditModal, {
			global:{
				plugins:[createStore(storeOptions)],
				mocks,
				stubs
			},
			props,
		});

		wrapper.findComponent(BaseModal).vm.$emit('update:active', false);

		expect(wrapper.emitted()['update:active'][0][0]).toBeFalsy();
	});

	it('Attempts to save a new story and shows validation errors', async () => {
		const saveStub = sinon.stub().returns({
			status: 422,
			id: 1
		});
		storeOptions.modules.Stories.actions.save = saveStub;

		const wrapper = mount(StoryEditModal, {
			global:{
				plugins:[createStore(storeOptions)],
				mocks,
				stubs
			},
			props
		});

		wrapper.find('button').trigger('click');

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(saveStub.calledOnce).toBeTruthy();
		expect(saveStub.calledWith(sinon.match.any, {
			name: '',
			published: false
		})).toBeTruthy();

		expect(wrapper.find('.help.is-danger').exists()).toBeTruthy();
	});

	it('Attempts to save a new story and shows server error toast', async () => {
		const saveStub = sinon.stub().returns({
			status: 500,
		});
		storeOptions.modules.Stories.actions.save = saveStub;

		const wrapper = mount(StoryEditModal, {
			global:{
				plugins:[createStore(storeOptions)],
				mocks,
				stubs
			},
			props
		});

		await wrapper.setData({
			name: 'asd'
		});

		wrapper.find('button').trigger('click');

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});


		expect(saveStub.calledOnce).toBeTruthy();
		expect(saveStub.calledWith(sinon.match.any, {
			name: 'asd',
			published: false
		})).toBeTruthy();

		expect(mocks.$toast.error.calledOnce).toBeTruthy();
		expect(mocks.$toast.error.calledWith('Please try again at a later time', 'Saving failed.')).toBeTruthy();
	});

	it('Saves new story and emits success', async () => {
		const saveStub = sinon.stub().returns({
			status: 201,
			id: 1
		});
		storeOptions.modules.Stories.actions.save = saveStub;

		const wrapper = mount(StoryEditModal, {
			global:{
				plugins:[createStore(storeOptions)],
				mocks,
				stubs
			},
			props
		});

		await wrapper.setData({
			name: 'dsa'
		});

		wrapper.find('button').trigger('click');

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(saveStub.calledOnce).toBeTruthy();
		expect(saveStub.calledWith(sinon.match.any, {
			name: 'dsa',
			published: false
		})).toBeTruthy();

		expect(mocks.$toast.success.calledOnce).toBeTruthy();
		expect(mocks.$toast.success.calledWith(' ', 'Story saved.')).toBeTruthy();

		expect(wrapper.emitted()['saved'][0][0]).toBe(1);

	});

	it('Prefills story data when edit', async () => {

		props.story = story;

		const wrapper = mount(StoryEditModal, {
			global:{
				plugins:[createStore(storeOptions)],
				mocks,
				stubs
			},
			props
		});

		expect(wrapper.vm.$data.name).toBe(story.name);
		expect(wrapper.vm.$data.published).toBe(story.published);
	});

	it('Renders edit options when user is prefilled', async () => {
		props.story = story;

		const wrapper = mount(StoryEditModal, {
			global:{
				plugins:[createStore(storeOptions)],
				mocks,
				stubs
			},
			props
		});

		expect(wrapper.find('select').exists()).toBeTruthy();
		expect(wrapper.find('button.is-danger-background').exists()).toBeTruthy();
	});

	it('Attempts to update an existing story and shows server errors', async () => {
		const saveStub = sinon.stub().returns({
			status: 422,
		});
		storeOptions.modules.Stories.actions.save = saveStub;

		props.story = story;

		const wrapper = mount(StoryEditModal, {
			global:{
				plugins:[createStore(storeOptions)],
				mocks,
				stubs
			},
			props
		});

		await wrapper.setData({
			name: ''
		});

		wrapper.findAll('button').at(1).trigger('click');

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(saveStub.calledOnce).toBeTruthy();
		expect(saveStub.calledWith(sinon.match.any, {
			name: '',
			published: false
		})).toBeTruthy();

		expect(wrapper.find('.help.is-danger').exists()).toBeTruthy();
	});

	it('Attempts to update an existing story and shows server errors', async () => {
		const saveStub = sinon.stub().returns({
			status: 500,
		});
		storeOptions.modules.Stories.actions.save = saveStub;

		props.story = story;

		const wrapper = mount(StoryEditModal, {
			global:{
				plugins:[createStore(storeOptions)],
				mocks,
				stubs
			},
			props
		});

		wrapper.findAll('button').at(1).trigger('click');

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(saveStub.calledOnce).toBeTruthy();
		expect(saveStub.calledWith(sinon.match.any, {
			name: 'dla',
			published: false
		})).toBeTruthy();

		expect(mocks.$toast.error.calledOnce).toBeTruthy();
		expect(mocks.$toast.error.calledWith('Please try again at a later time', 'Saving failed.')).toBeTruthy();
	});

	it('Updates an existing story and emits success', async () => {

		const saveStub = sinon.stub().returns({
			status: 200,
			id: 1
		});
		storeOptions.modules.Stories.actions.save = saveStub;

		props.story = story;

		const wrapper = mount(StoryEditModal, {
			global:{
				plugins:[createStore(storeOptions)],
				mocks,
				stubs
			},
			props
		});

		await wrapper.setData({
			name: 'story',
			published: true
		});

		wrapper.findAll('button').at(1).trigger('click');

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(saveStub.calledOnce).toBeTruthy();
		expect(saveStub.calledWith(sinon.match.any, {
			name: 'story',
			published: true
		})).toBeTruthy();

		expect(mocks.$toast.success.calledOnce).toBeTruthy();
		expect(mocks.$toast.success.calledWith(' ', 'Story saved.')).toBeTruthy();

		expect(wrapper.emitted()['saved'][0][0]).toBe(1);
	});

	it('Shows error message when delete fails', async () => {
		const deleteStub = sinon.stub().returns(false);
		storeOptions.modules.Stories.actions.delete = deleteStub;

		props.story = story;

		const wrapper = mount(StoryEditModal, {
			global:{
				plugins:[createStore(storeOptions)],
				mocks,
				stubs
			},
			props
		});

		wrapper.findAll('button').at(0).trigger('click');

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(deleteStub.calledOnce).toBeTruthy();
		expect(deleteStub.calledWith()).toBeTruthy();

		expect(mocks.$toast.error.calledOnce).toBeTruthy();
		expect(mocks.$toast.error.calledWith('Please try again at a later time', 'Delete failed.')).toBeTruthy();
	});

	it('Deletes story and does completes process', async () => {

		const deleteStub = sinon.stub().returns(true);
		storeOptions.modules.Stories.actions.delete = deleteStub;
		const exitStub = sinon.stub();
		storeOptions.modules.Stories.mutations.exit = exitStub;

		props.story = story;

		const wrapper = mount(StoryEditModal, {
			global:{
				plugins:[createStore(storeOptions)],
				mocks,
				stubs
			},
			props
		});

		wrapper.findAll('button').at(0).trigger('click');

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(deleteStub.calledOnce).toBeTruthy();
		expect(deleteStub.calledWith()).toBeTruthy();

		expect(mocks.$toast.success.calledOnce).toBeTruthy();
		expect(mocks.$toast.success.calledWith(' ', 'Story deleted.')).toBeTruthy();

		expect(exitStub.calledOnce).toBeTruthy();
		expect(exitStub.calledWith()).toBeTruthy();

		expect(mocks.$router.push.calledOnce).toBeTruthy();
		expect(mocks.$router.push.calledWith('/username')).toBeTruthy();
	});
});
