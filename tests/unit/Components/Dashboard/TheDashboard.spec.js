import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import TheDashboard from '@/Components/Dashboard/TheDashboard';
import sinon from 'sinon';

describe('TheDashboard.vue', () => {

	let mocks;
	const stubs = {
		FontAwesomeIcon: true,
		ProfileEdit: true
	};

	beforeEach(() => {
		global.window.matchMedia = sinon.stub().returns({
			matches: false
		});
		mocks = {
			$bus: {
				$on: sinon.spy(),
				$off: sinon.spy()
			},
			$store: {
				state: {
					Markers: {
						username: false
					},
					Profile: {
						user: null
					},
					User: {
						user: null
					}
				}
			}
		}
	});

	afterEach(() => {
		delete global.window.matchMedia;
		sinon.restore();
	});

	it('Renders without create-marker modal', async () => {
		const wrapper = shallowMount(TheDashboard, {
			stubs,
			mocks
		});

		assert.isTrue(wrapper.find('MarkerBordersFilter-stub').exists());
		assert.isTrue(wrapper.find('ViewMarker-stub').exists());
		assert.isTrue(wrapper.find('MarkerList-stub').exists());
	});

	it('Renders logged out bar when no user', () => {
		const wrapper = shallowMount(TheDashboard, {
			stubs,
			mocks
		});

		assert.isTrue(wrapper.find('LoggedOutBar-stub').exists());
		assert.isFalse(wrapper.find('LoggedInBar-stub').exists());
	});


	it('Renders logged in bar when authenticated', () => {

		mocks.$store.state.User.user = {};

		const wrapper = shallowMount(TheDashboard, {
			stubs,
			mocks
		});

		assert.isFalse(wrapper.find('LoggedOutBar-stub').exists());
		assert.isTrue(wrapper.find('LoggedInBar-stub').exists());
	});

	it('Toggles profile class when there is a user', () => {
		mocks.$store.state.Markers.username = 'test';
		const wrapper = shallowMount(TheDashboard, {
			stubs,
			mocks
		});

		assert.isTrue(wrapper.find('.dashboard--with-profile').exists());
	});

	it('Toggles profileEdit when profile and logged in user is same', () => {
		mocks.$store.state.Markers.username = 'test';
		mocks.$store.state.Profile.user = {
			username: 'test'
		};
		mocks.$store.state.User.user = {
			username: 'test'
		};
		const wrapper = shallowMount(TheDashboard, {
			stubs,
			mocks
		});

		assert.isTrue(wrapper.find('profileedit-stub').exists());
	});

	it('Toggles profileDisplay when profile and logged in user is same', () => {
		mocks.$store.state.Markers.username = 'test1';
		mocks.$store.state.Profile.user = {
			username: 'test1'
		};
		mocks.$store.state.User.user = {
			username: 'test'
		};
		const wrapper = shallowMount(TheDashboard, {
			stubs,
			mocks
		});

		assert.isTrue(wrapper.find('profiledisplay-stub').exists());
	});

	it('No profile displays shown when no username', () => {
		const wrapper = shallowMount(TheDashboard, {
			stubs,
			mocks
		});

		assert.isFalse(wrapper.find('profiledisplay-stub').exists());
		assert.isFalse(wrapper.find('profileedit-stub').exists());
	});

});
