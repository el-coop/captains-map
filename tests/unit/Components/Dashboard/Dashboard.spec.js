import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Dashboard from '@/Components/Dashboard/Dashboard';
import sinon from 'sinon';
import Auth from '@/Services/authentication.service';

describe('Dashboard.vue', () => {

	let mocks;

	beforeEach(() => {
		mocks = {
			$bus: {
				$on: sinon.spy(),
				$off: sinon.spy()
			},
			$modal: {
				show: sinon.spy()
			}
		}
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Renders without create-marker modal', () => {
		const wrapper = shallowMount(Dashboard, {
			stubs: {
				'font-awesome-icon': true
			},
			mocks
		});

		assert.isTrue(wrapper.find('profile-stub').exists());
		assert.isTrue(wrapper.find('markerbordersfilter-stub').exists());
		assert.isTrue(wrapper.find('viewmarker-stub').exists());
		assert.isTrue(wrapper.find('markerlist-stub').exists());
		assert.isFalse(wrapper.find('createmarker-stub').exists());
	});

	it('Renders with create-marker modal when edit mode', () => {
		const wrapper = shallowMount(Dashboard, {
			propsData: {
				editMode: true
			},
			stubs: {
				'font-awesome-icon': true
			},
			mocks
		});

		assert.isTrue(wrapper.find('profile-stub').exists());
		assert.isTrue(wrapper.find('viewmarker-stub').exists());
		assert.isTrue(wrapper.find('markerlist-stub').exists());
		assert.isTrue(wrapper.find('createmarker-stub').exists());
	});

	it('Registers listeners', () => {
		shallowMount(Dashboard, {
			propsData: {
				editMode: true
			},
			stubs: {
				'font-awesome-icon': true
			},
			mocks
		});

		assert.isTrue(mocks.$bus.$on.calledWith('moving-map'));
		assert.isTrue(mocks.$bus.$on.calledWith('marker-click'));
		assert.isTrue(mocks.$bus.$on.calledWith('map-right-click'));
		assert.isTrue(mocks.$bus.$on.calledWith('user-marker-click'));
	});

	it('Unregisters listeners', () => {
		const wrapper = shallowMount(Dashboard, {
			propsData: {
				editMode: true
			},
			stubs: {
				'font-awesome-icon': true
			},
			mocks
		});

		wrapper.destroy();

		assert.isTrue(mocks.$bus.$off.calledWith('moving-map'));
		assert.isTrue(mocks.$bus.$off.calledWith('marker-click'));
		assert.isTrue(mocks.$bus.$off.calledWith('map-right-click'));
		assert.isTrue(mocks.$bus.$off.calledWith('user-marker-click'));
	});

	it('selects a marker to show and displays the modal', () => {
		const wrapper = shallowMount(Dashboard, {
			stubs: {
				'font-awesome-icon': true
			},
			mocks
		});

		const marker = {
			id: 1,
			lat: 1,
			lng: 1
		};

		wrapper.vm.showMarker(marker);

		assert.deepEqual(wrapper.vm.$data.selectedMarker, marker);
		assert.isTrue(mocks.$modal.show.calledOnce);
		assert.isTrue(mocks.$modal.show.calledWith('view-marker'));
	});

	it('closes the sidebar', () => {
		const wrapper = shallowMount(Dashboard, {
			stubs: {
				'font-awesome-icon': true
			},
			mocks
		});

		wrapper.setData({
			openSidebar: true
		});

		wrapper.vm.closeSidebar();

		assert.isFalse(wrapper.vm.$data.openSidebar);
		assert.isFalse(wrapper.find('.dashboard__body-sidebar.open').exists());
	});

	it('Shows the create modal when in edit mode', () => {
		const wrapper = shallowMount(Dashboard, {
			propsData: {
				editMode: true
			},
			stubs: {
				'font-awesome-icon': true
			},
			mocks
		});

		const latLng = {
			lat: 1,
			lng: 1
		};

		wrapper.vm.createMarker(latLng);

		assert.deepEqual(wrapper.vm.$data.latLng, latLng);
		assert.isTrue(mocks.$modal.show.calledWith('create-marker'));
	});

	it('Doesnt shows the create modal when in view mode', () => {
		const wrapper = shallowMount(Dashboard, {
			propsData: {
				editMode: false
			},
			stubs: {
				'font-awesome-icon': true
			},
			mocks
		});

		const latLng = {
			lat: 1,
			lng: 1
		};

		wrapper.vm.createMarker(latLng);

		assert.deepEqual(wrapper.vm.$data.latLng, {});
		assert.isFalse(mocks.$modal.show.calledWith('create-marker'));
	});

	it('It toggles list on when clicked and list is off', () => {
		const wrapper = shallowMount(Dashboard, {
			propsData: {
				editMode: false
			},
			stubs: {
				'font-awesome-icon': true
			},
			mocks
		});

		wrapper.setData({
			openSidebar: false
		});
		wrapper.find('button').trigger('click');

		assert.isTrue(wrapper.vm.$data.openSidebar);
		assert.isTrue(wrapper.find('.dashboard__body-sidebar.open').exists());
	});

	it('It toggles list off when clicked and list is on', () => {
		const wrapper = shallowMount(Dashboard, {
			propsData: {
				editMode: false
			},
			stubs: {
				'font-awesome-icon': true
			},
			mocks
		});

		wrapper.setData({
			openSidebar: true
		});
		wrapper.find('button').trigger('click');

		assert.isFalse(wrapper.vm.$data.openSidebar);
		assert.isFalse(wrapper.find('.dashboard__body-sidebar.open').exists());
	});
	it('Renders logged out bar when no user', () => {
		const wrapper = shallowMount(Dashboard, {
			stubs: {
				'font-awesome-icon': true
			},
			mocks
		});

		assert.isTrue(wrapper.find('loggedoutbar-stub').exists());
		assert.isFalse(wrapper.find('loggedinbar-stub').exists());
	});


	it('Renders logged in bar when authenticated', () => {
		sinon.stub(Auth, 'isLoggedIn').returns(true);
		const wrapper = shallowMount(Dashboard, {
			stubs: {
				'font-awesome-icon': true
			},
			mocks
		});

		assert.isFalse(wrapper.find('loggedoutbar-stub').exists());
		assert.isTrue(wrapper.find('loggedinbar-stub').exists());
		assert.isTrue(wrapper.find('.dashboard.dashboard--big-mobile-header').exists());
	});

});