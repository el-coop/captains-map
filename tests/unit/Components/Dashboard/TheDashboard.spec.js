import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import TheDashboard from '@/Components/Dashboard/TheDashboard';
import sinon from 'sinon';
import Auth from '@/Services/AuthenticationService';

describe('TheDashboard.vue', () => {

	let mocks;
	const stubs = {
		FontAwesomeIcon: true
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

		assert.isFalse(wrapper.find('MarkerBordersFilter-stub').exists());
		assert.isTrue(wrapper.find('ViewMarker-stub').exists());
		assert.isTrue(wrapper.find('MarkerList-stub').exists());
	});

	it('Renders markers filter when showFilters true', async () => {
		const wrapper = shallowMount(TheDashboard, {
			stubs,
			mocks
		});

		wrapper.setData({
			showFilters: true
		});

		assert.isTrue(wrapper.find('MarkerBordersFilter-stub').exists());
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
		sinon.stub(Auth, 'isLoggedIn').returns(true);
		const wrapper = shallowMount(TheDashboard, {
			stubs,
			mocks
		});

		assert.isFalse(wrapper.find('LoggedOutBar-stub').exists());
		assert.isTrue(wrapper.find('LoggedInBar-stub').exists());
	});

	it('Toggles profile class when there is a user', () => {
		mocks.$store.state.Markers.username = 'test';
		sinon.stub(Auth, 'isLoggedIn').returns(true);
		const wrapper = shallowMount(TheDashboard, {
			stubs,
			mocks
		});

		assert.isTrue(wrapper.find('.dashboard--with-profile').exists());
	});

	it('Toggles show filter on and of on button click', async () => {
		const wrapper = shallowMount(TheDashboard, {
			stubs,
			mocks
		});

		assert.isFalse(wrapper.find('MarkerBordersFilter-stub').exists());

		const button = wrapper.find('.dashboard__control-filters');

		button.trigger('click');

		assert.isTrue(wrapper.vm.$data.showFilters);
		assert.isTrue(wrapper.find('MarkerBordersFilter-stub').exists());

		button.trigger('click');

		assert.isFalse(wrapper.vm.$data.showFilters);
		assert.isFalse(wrapper.find('MarkerBordersFilter-stub').exists());
	});

});
