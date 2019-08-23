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
			matches: true
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

		assert.isTrue(wrapper.find('MarkerBordersFilter-stub').exists());
		assert.isTrue(wrapper.find('ViewMarker-stub').exists());
		assert.isTrue(wrapper.find('MarkerList-stub').exists());
	});

	it('Registers listeners', () => {
		shallowMount(TheDashboard, {
			propsData: {
				editMode: true
			},
			stubs,
			mocks
		});

		assert.isTrue(mocks.$bus.$on.calledWith('moving-map'));
	});

	it('Unregisters listeners', () => {
		const wrapper = shallowMount(TheDashboard, {
			propsData: {
				editMode: true
			},
			stubs,
			mocks
		});

		wrapper.destroy();

		assert.isTrue(mocks.$bus.$off.calledWith('moving-map'));
	});

	it('closes the sidebar', () => {
		global.window.matchMedia = sinon.stub().returns({
			matches: false
		});
		const wrapper = shallowMount(TheDashboard, {
			stubs,
			mocks
		});

		wrapper.setData({
			openSidebar: true
		});

		wrapper.vm.closeSidebar();

		assert.isFalse(wrapper.vm.$data.openSidebar);
		assert.isFalse(wrapper.find('marker-list-stub').exists());

	});

	it('It toggles list on when clicked and list is off', () => {
		global.window.matchMedia = sinon.stub().returns({
			matches: false
		});
		const wrapper = shallowMount(TheDashboard, {
			propsData: {
				editMode: false
			},
			stubs,
			mocks
		});

		wrapper.setData({
			openSidebar: false
		});
		wrapper.find('button').trigger('click');

		assert.isTrue(wrapper.vm.$data.openSidebar);
		assert.isTrue(wrapper.find('MarkerList-stub').exists());
	});

	it('It toggles list off when clicked and list is on', () => {
		const wrapper = shallowMount(TheDashboard, {
			propsData: {
				editMode: false
			},
			stubs,
			mocks
		});

		wrapper.setData({
			openSidebar: true
		});
		wrapper.find('button').trigger('click');

		assert.isFalse(wrapper.vm.$data.openSidebar);
		assert.isFalse(wrapper.find('.TheDashboard__body-sidebar.open').exists());
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

});
