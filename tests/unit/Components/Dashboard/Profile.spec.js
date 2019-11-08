import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Profile from '@/Components/Dashboard/Profile';
import sinon from 'sinon';
import globe from '@/assets/images/globe-icon.png';

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
					},
					User: {
						user: null
					}
				},
				commit: sinon.stub()
			},
			$http: {

			},
			$toast: {
				success: sinon.stub(),
				error: sinon.stub()
			}
		};
		stubs = {
			FontAwesomeIcon: true
		};
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Renders', async () => {
		const wrapper = shallowMount(Profile, {
			stubs,
			mocks
		});

		assert.isTrue(wrapper.find('.dashboard__control.profile').exists());
		assert.equal(wrapper.find('.title.is-4').text(), 'test');
	});

	it('Toggles open', async () => {
		mocks.$store.state.Profile.open = true;

		const wrapper = shallowMount(Profile, {
			stubs,
			mocks
		});

		assert.isTrue(wrapper.find('.dashboard__control.profile.profile--open').exists());
	});

	it('Closes when clicked', async () => {
		mocks.$store.state.Profile.open = true;

		const wrapper = shallowMount(Profile, {
			stubs,
			mocks
		});

		wrapper.find('.icon.profile__close').trigger('click');

		await wrapper.vm.$nextTick();

		assert.isTrue(mocks.$store.commit.calledOnce);
		assert.isTrue(mocks.$store.commit.calledWith('Profile/toggle'));
	});
});
