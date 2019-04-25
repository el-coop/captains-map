import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Profile from '@/Components/Dashboard/Profile';
import sinon from 'sinon';
import globe from '@/assets/images/globe-icon.png';
import auth from '@/Services/authentication.service';

describe('Profile.vue', () => {

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
					}
				},
				commit: sinon.stub()
			},
			$toast: {
				success: sinon.stub(),
				error: sinon.stub()
			}
		};
		stubs = {
			'font-awesome-icon': true
		};
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Renders profile with globe picture', async () => {
		const wrapper = shallowMount(Profile, {
			stubs,
			mocks
		});

		assert.isTrue(wrapper.find('.dashboard__control.profile').exists());
		assert.isFalse(wrapper.find('ajax-form-stub').exists());
		assert.equal(wrapper.find('img').element.src, `http://localhost${globe}`);
		assert.equal(wrapper.find('h4').text(), 'test');
		assert.equal(wrapper.find('p.is-flex-1').text(), 'description');
	});

	it('Renders profile with actual profile picture', async () => {

		mocks.$store.state.Profile.user.path = '/path';

		const wrapper = shallowMount(Profile, {
			stubs,
			mocks
		});

		assert.isTrue(wrapper.find('.dashboard__control.profile').exists());
		assert.isFalse(wrapper.find('ajax-form-stub').exists());
		assert.equal(wrapper.find('img').element.src, 'http://localhost/api/path');
		assert.equal(wrapper.find('h4').text(), 'test');
		assert.equal(wrapper.find('p.is-flex-1').text(), 'description');
	});


	it('Renders edit mode when profile is same as logged in', async () => {


		sinon.stub(auth, 'getUserDetails').returns({
			username: 'test'
		});
		mocks.$store.state.Profile.user.path = '/path';

		const wrapper = shallowMount(Profile, {
			stubs,
			mocks
		});


		assert.isTrue(wrapper.find('.dashboard__control.profile').exists());
		assert.isTrue(wrapper.find('ajax-form-stub').exists());
		assert.equal(wrapper.find('file-field-stub').props().initPreview, '/api/path');
		assert.equal(wrapper.find('h4').text(), 'test');
		assert.equal(wrapper.find('textarea').element.value, 'description');
	});

	it('Reacts to submitting', async () => {

		sinon.stub(auth, 'getUserDetails').returns({
			username: 'test'
		});
		mocks.$store.state.Profile.user.path = '/path';

		const wrapper = shallowMount(Profile, {
			stubs,
			mocks
		});

		wrapper.find('ajax-form-stub').vm.$emit('submitting');

		assert.isTrue(wrapper.find('.button.is-loading').exists());
	});

	it('Reacts to failure submission', async () => {

		sinon.stub(auth, 'getUserDetails').returns({
			username: 'test'
		});
		mocks.$store.state.Profile.user.path = '/path';

		const wrapper = shallowMount(Profile, {
			stubs,
			mocks
		});

		wrapper.find('ajax-form-stub').vm.$emit('submitted', {
			status: 403
		});

		assert.isTrue(mocks.$toast.error.calledOnce);
		assert.isTrue(mocks.$toast.error.calledWith('Please try again at a later time', 'Update failed.'));
	});

	it('Reacts to success submission with image update', async () => {

		sinon.stub(auth, 'getUserDetails').returns({
			username: 'test'
		});
		mocks.$store.state.Profile.user.path = '/path';

		const wrapper = shallowMount(Profile, {
			stubs,
			mocks
		});

		wrapper.find('ajax-form-stub').vm.$emit('submitted', {
			status: 200,
			data: {
				description: 'desc',
				path: 'patha'
			}
		});

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
