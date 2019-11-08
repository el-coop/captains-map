import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import ProfileEdit from '@/Components/Dashboard/Profile/ProfileEdit';
import sinon from 'sinon';
import globe from '@/assets/images/globe-icon.png';

describe('ProfileEdit.vue', () => {

	let mocks;
	let stubs;

	beforeEach(() => {
		mocks = {
			$store: {
				state: {
					Profile: {
						user: {
							username: 'test',
							description: 'description',
							path: false
						}
					},
					User: {
						user: null
					}
				},
				commit: sinon.stub()
			},
			$http: {},
			$toast: {
				success: sinon.stub(),
				error: sinon.stub()
			}
		};
		stubs = {
			FontAwesomeIcon: true,
			MultiFileField: true
		};
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Renders profile with globe picture', async () => {
		const wrapper = mount(ProfileEdit, {
			stubs,
			mocks
		});

		assert.isTrue(wrapper.find('.dashboard__control.profile').exists());
		assert.equal(wrapper.find('multifilefield-stub').attributes().preview, globe);
		assert.equal(wrapper.find('h4').text(), 'test');
		assert.equal(wrapper.vm.$data.description, 'description');
	});

	it('Renders profile with actual profile picture', async () => {

		mocks.$store.state.Profile.user.path = '/path';

		const wrapper = mount(ProfileEdit, {
			stubs,
			mocks
		});

		assert.isTrue(wrapper.find('.dashboard__control.profile').exists());
		assert.equal(wrapper.find('multifilefield-stub').attributes().preview, '/api/path');
		assert.equal(wrapper.find('h4').text(), 'test');
		assert.equal(wrapper.vm.$data.description, 'description');
	});

	it('Reacts to failure submission', async () => {

		mocks.$http.post = sinon.stub().returns({
			status: 500,
		});
		mocks.$store.state.Profile.user.path = '/path';

		const wrapper = mount(ProfileEdit, {
			stubs,
			mocks
		});

		wrapper.find('button.is-primary-background').trigger('click');

		await wrapper.vm.$nextTick;

		assert.isTrue(mocks.$toast.error.calledOnce);
		assert.isTrue(mocks.$toast.error.calledWith('Please try again at a later time', 'Update failed.'));
	});

	it('Submits data successfully', async () => {

		mocks.$store.state.User.user = {
			username: 'test'
		};

		mocks.$http.post = sinon.stub().returns({
			status: 200,
			data: {
				description: 'desc',
				path: 'patha'
			}
		});
		mocks.$store.state.Profile.user.path = '/path';

		const wrapper = mount(ProfileEdit, {
			stubs,
			mocks
		});

		wrapper.find('button.is-primary-background').trigger('click');

		assert.isTrue(wrapper.find('button.is-primary-background.is-loading').exists());

		await wrapper.vm.$nextTick();

		assert.isFalse(wrapper.find('button.is-primary-background.is-loading').exists());

		assert.isTrue(mocks.$toast.success.calledOnce);
		assert.isTrue(mocks.$toast.success.calledWith(' ', 'Profile updated.'));
		assert.isTrue(mocks.$store.commit.calledTwice);
		assert.isTrue(mocks.$store.commit.firstCall.calledWith('Markers/updateProfilePic', {
			username: 'test',
			path: 'patha'
		}));
		assert.isTrue(mocks.$store.commit.secondCall.calledWith('Profile/updateBio', {
			username: 'test',
			description: 'desc',
			path: 'patha'
		}));
	});

});
