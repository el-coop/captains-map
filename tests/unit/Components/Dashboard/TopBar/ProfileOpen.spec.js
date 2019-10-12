import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import ProfileOpen from '@/Components/Dashboard/TopBar/ProfileOpen';
import sinon from 'sinon';
import globe from '@/assets/images/globe-icon.png';


describe('ProfileOpen.vue', () => {

	let mocks;
	let stubs;

	beforeEach(() => {
		mocks = {
			$store: {
				state: {
					Profile: {
						user: {
							username: 'test',
							path: '/testpath'
						}
					},
					Webpush: {
						hasPush: true
					}
				},
				commit: sinon.stub()
			}
		};

		stubs = {
			FontAwesomeIcon: true,
			FollowButton: true
		};
	});

	afterEach(() => {
		sinon.restore();
	});


	it('Renders username and logo when they exist and webpush', () => {
		const wrapper = shallowMount(ProfileOpen, {
			mocks,
			stubs
		});

		assert.equal(wrapper.find('img').element.src, 'http://localhost/api/testpath');
		assert.equal(wrapper.find('.profile-open__button-text').text(), 'test');
		assert.isTrue(wrapper.find('followbutton-stub').exists());
	});



	it('Renders globe when no image exists', () => {
		mocks.$store.state.Profile.user.path = null;
		const wrapper = shallowMount(ProfileOpen, {
			mocks,
			stubs
		});

		assert.equal(wrapper.find('img').element.src, `http://localhost${globe}`);
		assert.equal(wrapper.find('.profile-open__button-text').text(), 'test');
	});

	it('Doesnt have follow button when no push', () => {
		mocks.$store.state.Webpush.hasPush = false;
		const wrapper = shallowMount(ProfileOpen, {
			mocks,
			stubs
		});

		assert.isFalse(wrapper.find('followbutton-stub').exists());
	});

	it('Triggers toggle on store when clicked', () => {
		mocks.$store.state.Profile.user.path = null;
		const wrapper = shallowMount(ProfileOpen, {
			mocks,
			stubs
		});

		wrapper.find('.profile-open__button').trigger('click');

		assert.isTrue(mocks.$store.commit.calledOnce);
		assert.isTrue(mocks.$store.commit.calledWith('Profile/toggle'));
	});

});
