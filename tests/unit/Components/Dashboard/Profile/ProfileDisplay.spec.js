import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import ProfileDisplay from '@/Components/Dashboard/Profile/ProfileDisplay';
import sinon from 'sinon';
import globe from '@/assets/images/globe-icon.png';

describe('ProfileDisplay.vue', () => {

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
						},
						open: true
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
			FontAwesomeIcon: true
		};
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Renders profile with globe picture', async () => {
		const wrapper = mount(ProfileDisplay, {
			stubs,
			mocks
		});

		await wrapper.vm.$nextTick();

		assert.equal(wrapper.find('img').element.src, `http://localhost${globe}`);
		assert.equal(wrapper.find('h4').text(), 'test');
		assert.equal(wrapper.find('.profile__content-text').text(), 'description');
	});

	it('Renders profile with actual profile picture', async () => {

		mocks.$store.state.Profile.user.path = '/path';
		const wrapper = mount(ProfileDisplay, {
			stubs,
			mocks
		});

		await wrapper.vm.$nextTick();

		assert.equal(wrapper.find('img').element.src, 'http://localhost/api/path');
		assert.equal(wrapper.find('h4').text(), 'test');
		assert.equal(wrapper.find('.profile__content-text').text(), 'description');
	});
});
