import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import UserMarkerControl from '@/Components/Map/Controls/MapUserMarkerControl';
import sinon from 'sinon';

describe('MapUserMarkerControl.vue', () => {

	let mocks;

	const stubs = {
		FontAwesomeIcon: true
	};

	beforeEach(() => {
		mocks = {
			$store: {
				dispatch: sinon.spy(),
				state: {
					Markers: {
						userMarker: false
					}
				}
			}
		}
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Renders', () => {
		const parent = {
			methods: {
				addObject: sinon.spy()
			}
		};
		const wrapper = shallowMount(UserMarkerControl, {
			parentComponent: parent,
			stubs,
			mocks
		});

		assert.isTrue(wrapper.find('.leaflet-bar.leaflet-control').exists());
		assert.isFalse(wrapper.find('.active').exists());
	});


	it('Puts active class when turned on', () => {
		const parent = {
			methods: {
				addObject: sinon.spy()
			}
		};
		mocks.$store.state.Markers.userMarker = true;

		const wrapper = shallowMount(UserMarkerControl, {
			parentComponent: parent,
			stubs,
			mocks
		});

		assert.isTrue(wrapper.find('.map__user-marker-control--active').exists());
	});

	it('Toggles on user marker on click', async () => {

		const parent = {
			methods: {
				addObject: sinon.spy()
			}
		};
		mocks.$toast = {
			info: sinon.spy()
		};
		const wrapper = shallowMount(UserMarkerControl, {
			parentComponent: parent,
			stubs,
			mocks
		});

		wrapper.find('a').trigger('click');

		assert.isTrue(mocks.$toast.info.calledOnce);
		assert.isTrue(mocks.$toast.info.calledWith('Calculating location, please wait.', ''));
		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('Markers/toggleUserMarker'));

	});

	it('Toggles off user marker on click', () => {
		const parent = {
			methods: {
				addObject: sinon.spy()
			}
		};
		mocks.$toast = {
			info: sinon.spy()
		};
		mocks.$store.state.Markers.userMarker = true;
		const wrapper = shallowMount(UserMarkerControl, {
			parentComponent: parent,
			stubs,
			mocks
		});

		wrapper.find('a').trigger('click');

		assert.isTrue(mocks.$toast.info.calledOnce);
		assert.isTrue(mocks.$toast.info.calledWith('Turning off location service.', ''));
		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('Markers/toggleUserMarker'));
	});

	it('Adds control when created', () => {
		const parent = {
			methods: {
				addObject: sinon.spy()
			}
		};
		const wrapper = shallowMount(UserMarkerControl, {
			parentComponent: parent,
			stubs,
			mocks
		});

		assert.isTrue(parent.methods.addObject.calledOnce);
		assert.isTrue(parent.methods.addObject.calledWith(wrapper.vm.mapObject));
	});

	it('Removes control when destroyed', () => {
		const parent = {
			methods: {
				addObject: sinon.spy(),
				removeObject: sinon.spy(),
			}
		};
		const wrapper = shallowMount(UserMarkerControl, {
			parentComponent: parent,

			stubs,
			mocks
		});

		wrapper.destroy();
		assert.isTrue(parent.methods.removeObject.calledOnce);
		assert.isTrue(parent.methods.removeObject.calledWith(wrapper.vm.mapObject));
	});

	it('Fires go to marker event when right clicked and user marker is on', () => {
		const parent = {
			methods: {
				addObject: sinon.spy(),
			}
		};
		mocks.$bus = {
			$emit: sinon.spy()
		};
		mocks.$store.state.Markers.userMarker = true;

		const wrapper = shallowMount(UserMarkerControl, {
			parentComponent: parent,
			stubs,
			mocks
		});
		wrapper.find('a').trigger('contextmenu');

		assert.isTrue(mocks.$bus.$emit.calledOnce);
		assert.isTrue(mocks.$bus.$emit.calledWith('goToUserMarker'));

	});

	it('Doesnt fire go to marker event when right clicked and user marker is off', () => {
		const parent = {
			methods: {
				addObject: sinon.spy(),
			}
		};
		mocks.$bus = {
			$emit: sinon.spy()
		};
		const wrapper = shallowMount(UserMarkerControl, {
			parentComponent: parent,
			stubs,
			mocks
		});
		wrapper.find('a').trigger('contextmenu');

		assert.isFalse(mocks.$bus.$emit.called);

	});
});
