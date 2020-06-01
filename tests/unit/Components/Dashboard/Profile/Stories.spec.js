import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import Stories from '@/Components/Dashboard/Profile/Stories';
import sinon from 'sinon';
import globe from '@/assets/images/globe-icon.png';

describe('Stories.vue', () => {

	let mocks;
	let stubs;

	beforeEach(() => {
		mocks = {
			$store: {
				state: {
					User: {
						user: {
							username: 'test'
						}
					},
					Profile: {
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
					}
				},
				commit: sinon.stub()
			},
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
		mocks.$store.state.User.user = null;

		const wrapper = mount(Stories, {
			stubs,
			mocks
		});

		assert.isTrue(wrapper.find('.stories').exists());
		assert.isFalse(wrapper.find('StoryEditModal-stub').exists());
		assert.equal(wrapper.findAll('.story').length, 2)
	});

	it('Renders without stories when logged out', async () => {
		mocks.$store.state.User.user = null;
		mocks.$store.state.Profile.stories = [];

		const wrapper = mount(Stories, {
			stubs,
			mocks
		});

		assert.isTrue(wrapper.find('.stories').exists());
		assert.isFalse(wrapper.find('StoryEditModal-stub').exists());
		assert.equal(wrapper.findAll('.story').length, 0)
	});

	it('Renders with stories when not same user', async () => {
		mocks.$store.state.User.user = {
			username: 'kla'
		};

		const wrapper = mount(Stories, {
			stubs,
			mocks
		});

		assert.isTrue(wrapper.find('.stories').exists());
		assert.isFalse(wrapper.find('StoryEditModal-stub').exists());
		assert.equal(wrapper.findAll('.story').length, 2)
	});

	it('Renders without stories when not same user', async () => {
		mocks.$store.state.User.user = {
			username: 'kla'
		};
		mocks.$store.state.Profile.stories = [];

		const wrapper = mount(Stories, {
			stubs,
			mocks
		});

		assert.isTrue(wrapper.find('.stories').exists());
		assert.isFalse(wrapper.find('StoryEditModal-stub').exists());
		assert.equal(wrapper.findAll('.story').length, 0)
	});

	it('Renders with stories when can edit', async () => {
		const wrapper = mount(Stories, {
			stubs,
			mocks
		});

		assert.isTrue(wrapper.find('.stories').exists());
		assert.isTrue(wrapper.find('StoryEditModal-stub').exists());
		assert.equal(wrapper.findAll('.story').length, 3)
	});

	it('Renders without stories when can edit', async () => {
		mocks.$store.state.Profile.stories = [];

		const wrapper = mount(Stories, {
			stubs,
			mocks
		});

		assert.isTrue(wrapper.find('.stories').exists());
		assert.isTrue(wrapper.find('StoryEditModal-stub').exists());
		assert.equal(wrapper.findAll('.story').length, 1)
	});

	it('Opens modal when new is clicked', async () => {
		const wrapper = mount(Stories, {
			stubs,
			mocks
		});

		wrapper.find('.story__link').trigger('click');

		assert.isTrue(wrapper.vm.$data.createModal);
	});

	it('Triggers routing to story when story is clicked', async () => {
		const wrapper = mount(Stories, {
			stubs,
			mocks
		});

		wrapper.findAll('.story__link').at(1).trigger('click');

		assert.isTrue(mocks.$store.commit.called);
		assert.isTrue(mocks.$store.commit.calledWith('Profile/toggle'));
		assert.isTrue(mocks.$router.push.called);
		assert.isTrue(mocks.$router.push.calledWith('test/story/1'));
	});
});
