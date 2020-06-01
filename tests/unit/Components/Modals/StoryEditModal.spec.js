import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import StoryEditModal from '@/Components/Modals/StoryEditModal';
import sinon, { mock } from 'sinon';

describe('StoryEditModal.vue', () => {
	const stubs = {
		FontAwesomeIcon: true
	};

	const story = {
		user_id: 1,
		name: 'dla',
		published: 0,
	};


	let propsData;
	let mocks;

	beforeEach(() => {
		mocks = {
			$store: {
				commit: sinon.stub(),
				dispatch: sinon.stub().returns({
					status: 422,
					id: 1
				}),
				state: {
					User: {
						user: {
							id: 1
						}
					},
				}
			},
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
			}
		};
		propsData = {
			active: true,
		};
	});

	afterEach(() => {
		sinon.restore();
	});

	it('renders modal when active', () => {
		const wrapper = mount(StoryEditModal, {
			propsData,
			mocks,
			stubs
		});

		assert.isTrue(wrapper.find('.modal').exists());
		assert.include(wrapper.html(), 'Choose story name');
		assert.isFalse(wrapper.find('select').exists());
		assert.isFalse(wrapper.find('button.is-danger-background').exists());
	});

	it('doesnt render modal when not active', () => {
		const wrapper = mount(StoryEditModal, {
			stubs
		});

		assert.isTrue(wrapper.find('.modal').exists());
		assert.notInclude(wrapper.html(), 'Choose story name');
	});

	it('closes modal on click when not editing', () => {
		const wrapper = mount(StoryEditModal, {
			stubs,
			mocks,
			propsData,
		});

		wrapper.find('.card__footer-item a').trigger('click');

		assert.equal(wrapper.emitted()['update:active'][0][0], false);
	});

	it('closes modal when emitted form modal', () => {
		const wrapper = mount(StoryEditModal, {
			stubs,
			mocks,
			propsData,
		});

		wrapper.vm.$children[0].$emit('update:active', false);

		assert.equal(wrapper.emitted()['update:active'][0][0], false);
	});

	it('Attempts to save a new story and shows validation errors', async () => {
		const wrapper = mount(StoryEditModal, {
			stubs,
			mocks,
			propsData
		});

		wrapper.find('button').trigger('click');

		await wrapper.vm.$nextTick();

		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('Stories/save', {
			name: '',
			published: 0
		}));

		assert.isTrue(wrapper.find('.help.is-danger').exists());
	});

	it('Attempts to save a new story and shows server error toast', async () => {
		mocks.$store.dispatch = sinon.stub().returns({
			status: 500
		});

		const wrapper = mount(StoryEditModal, {
			stubs,
			mocks,
			propsData
		});

		wrapper.setData({
			name: 'asd'
		});

		wrapper.find('button').trigger('click');

		await wrapper.vm.$nextTick();

		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('Stories/save', {
			name: 'asd',
			published: 0
		}));

		assert.isTrue(mocks.$toast.error.calledOnce);
		assert.isTrue(mocks.$toast.error.calledWith('Please try again at a later time', 'Saving failed.'));
	});

	it('Saves new story and emits success', async () => {
		mocks.$emit = sinon.stub();
		mocks.$store.dispatch = sinon.stub().returns({
			status: 201,
			id: 1
		});

		const wrapper = mount(StoryEditModal, {
			stubs,
			mocks,
			propsData
		});

		wrapper.setData({
			name: 'dsa'
		});

		wrapper.find('button').trigger('click');

		await wrapper.vm.$nextTick();

		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('Stories/save', {
			name: 'dsa',
			published: 0
		}));

		assert.isTrue(mocks.$toast.success.calledOnce);
		assert.isTrue(mocks.$toast.success.calledWith(' ', 'Story saved.'));

		assert.isTrue(mocks.$emit.calledOnce);
		assert.isTrue(mocks.$emit.calledWith('saved', 1));
	});

	it('Prefills story data when edit', async () => {

		propsData.story = story;

		const wrapper = mount(StoryEditModal, {
			stubs,
			mocks,
			propsData
		});

		assert.equal(wrapper.vm.$data.name, story.name);
		assert.equal(wrapper.vm.$data.published, story.published);
	});

	it('Renders edit options when user is prefilled', async () => {
		propsData.story = story;

		const wrapper = mount(StoryEditModal, {
			stubs,
			mocks,
			propsData
		});

		assert.isTrue(wrapper.find('select').exists());
		assert.isTrue(wrapper.find('button.is-danger-background').exists());
	});

	it('Attempts to update an existing story and shows server errors', async () => {
		mocks.$store.dispatch = sinon.stub().returns({
			status: 422
		});

		propsData.story = story;

		const wrapper = mount(StoryEditModal, {
			stubs,
			mocks,
			propsData
		});

		wrapper.setData({
			name: ''
		});

		wrapper.findAll('button').at(1).trigger('click');

		await wrapper.vm.$nextTick();

		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('Stories/save', {
			name: '',
			published: 0
		}));

		assert.isTrue(wrapper.find('.help.is-danger').exists());
	});

	it('Attempts to update an existing story and shows server errors', async () => {
		mocks.$store.dispatch = sinon.stub().returns({
			status: 500
		});
		propsData.story = story;

		const wrapper = mount(StoryEditModal, {
			stubs,
			mocks,
			propsData
		});

		wrapper.findAll('button').at(1).trigger('click');

		await wrapper.vm.$nextTick();

		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('Stories/save', {
			name: 'dla',
			published: 0
		}));

		assert.isTrue(mocks.$toast.error.calledOnce);
		assert.isTrue(mocks.$toast.error.calledWith('Please try again at a later time', 'Saving failed.'));
	});

	it('Updates an existing story and emits success', async () => {
		mocks.$emit = sinon.stub();
		mocks.$store.dispatch = sinon.stub().returns({
			status: 200,
			id: 1
		});
		propsData.story = story;

		const wrapper = mount(StoryEditModal, {
			stubs,
			mocks,
			propsData
		});

		wrapper.setData({
			name: 'story',
			published: 1
		});

		wrapper.findAll('button').at(1).trigger('click');

		await wrapper.vm.$nextTick();

		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('Stories/save', {
			name: 'story',
			published: 1
		}));

		assert.isTrue(mocks.$toast.success.calledOnce);
		assert.isTrue(mocks.$toast.success.calledWith(' ', 'Story saved.'));

		assert.isTrue(mocks.$emit.calledOnce);
		assert.isTrue(mocks.$emit.calledWith('saved', 1));
	});

	it('Shows error message when delete fails', async () => {
		mocks.$store.dispatch = sinon.stub().returns(false);
		propsData.story = story;

		const wrapper = mount(StoryEditModal, {
			stubs,
			mocks,
			propsData
		});

		wrapper.findAll('button').at(0).trigger('click');

		await wrapper.vm.$nextTick();

		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('Stories/delete'));

		assert.isTrue(mocks.$toast.error.calledOnce);
		assert.isTrue(mocks.$toast.error.calledWith('Please try again at a later time', 'Delete failed.'));
	});

	it('Deletes story and does completes process', async () => {
		mocks.$store.dispatch = sinon.stub().returns(true);
		propsData.story = story;

		const wrapper = mount(StoryEditModal, {
			stubs,
			mocks,
			propsData
		});

		wrapper.findAll('button').at(0).trigger('click');

		await wrapper.vm.$nextTick();

		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('Stories/delete'));

		assert.isTrue(mocks.$toast.success.calledOnce);
		assert.isTrue(mocks.$toast.success.calledWith(' ', 'Story deleted.'));

		assert.isTrue(mocks.$store.commit.calledOnce);
		assert.isTrue(mocks.$store.commit.calledWith('Stories/exit'));

		assert.isTrue(mocks.$router.push.calledOnce);
		assert.isTrue(mocks.$router.push.calledWith('/username'));
	});
});
