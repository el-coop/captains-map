import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Dashboard from '@/Components/Dashboard/Dashboard';
import sinon from 'sinon';
import Auth from '@/Services/authentication.service';

describe('Dashboard.vue', () => {

	let mocks;

	beforeEach(() => {
		global.window.matchMedia = sinon.stub().returns({
			matches: true
		});
		mocks = {
			$bus: {
				$on: sinon.spy(),
				$off: sinon.spy()
			},
			$modal: {
				show: sinon.spy()
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
		const wrapper = shallowMount(Dashboard, {
			stubs: {
				'font-awesome-icon': true
			},
			mocks
		});

		assert.isTrue(wrapper.find('marker-borders-filter-stub').exists());
		assert.isTrue(wrapper.find('view-marker-stub').exists());
		assert.isTrue(wrapper.find('marker-list-stub').exists());
		assert.isFalse(wrapper.find('create-marker-stub').exists());
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

		assert.isTrue(wrapper.find('view-marker-stub').exists());
		assert.isTrue(wrapper.find('marker-list-stub').exists());
		assert.isTrue(wrapper.find('create-marker-stub').exists());
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
		assert.isTrue(mocks.$bus.$on.calledWith('map-create-marker'));
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
		assert.isTrue(mocks.$bus.$off.calledWith('map-create-marker'));
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
		global.window.matchMedia = sinon.stub().returns({
			matches: false
		});
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
		assert.isFalse(wrapper.find('marker-list-stub').exists());

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
		global.window.matchMedia = sinon.stub().returns({
			matches: false
		});
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
		assert.isTrue(wrapper.find('marker-list-stub').exists());
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

		assert.isTrue(wrapper.find('logged-out-bar-stub').exists());
		assert.isFalse(wrapper.find('logged-in-bar-stub').exists());
	});


	it('Renders logged in bar when authenticated', () => {
		sinon.stub(Auth, 'isLoggedIn').returns(true);
		const wrapper = shallowMount(Dashboard, {
			stubs: {
				'font-awesome-icon': true
			},
			mocks
		});

		assert.isFalse(wrapper.find('logged-out-bar-stub').exists());
		assert.isTrue(wrapper.find('logged-in-bar-stub').exists());
	});

	it('Toggles profile class when there is a user', () => {
		mocks.$store.state.Markers.username = 'test';
		sinon.stub(Auth, 'isLoggedIn').returns(true);
		const wrapper = shallowMount(Dashboard, {
			stubs: {
				'font-awesome-icon': true
			},
			mocks
		});

		assert.isTrue(wrapper.find('.dashboard--with-profile').exists());
	});

});
