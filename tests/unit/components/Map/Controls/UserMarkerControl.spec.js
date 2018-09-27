import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import UserMarkerControl from '@/components/map/Controls/UserMarkerControl';
import sinon from 'sinon';

describe('UserMarkerControl.vue', () => {

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
			stubs: {
				'font-awesome-icon': true
			},
		});

		assert.isTrue(wrapper.find('.leaflet-bar.leaflet-control').exists());
	});

	it('Toggles on user marker on click', () => {

		const parent = {
			methods: {
				addObject: sinon.spy()
			}
		};
		const $store = {
			commit: sinon.spy(),
			state: {
				Markers: {
					userMarker: false
				}
			}
		};
		const $toast = {
			info: sinon.spy()
		};
		const wrapper = shallowMount(UserMarkerControl, {
			parentComponent: parent,
			stubs: {
				'font-awesome-icon': true
			},
			mocks: {
				$store,
				$toast
			}
		});

		wrapper.find('a').trigger('click');

		assert.isTrue($toast.info.calledOnce);
		assert.isTrue($toast.info.calledWith('Calculating location, please wait.', '', {
			position: 'bottomCenter'
		}));
		assert.isTrue($store.commit.calledOnce);
		assert.isTrue($store.commit.calledWith('Markers/toggleUserMarker'));
	});

	it('Toggles off user marker on click', () => {
		const parent = {
			methods: {
				addObject: sinon.spy()
			}
		};
		const $store = {
			commit: sinon.spy(),
			state: {
				Markers: {
					userMarker: true
				}
			}
		};
		const $toast = {
			info: sinon.spy()
		};
		const wrapper = shallowMount(UserMarkerControl, {
			parentComponent: parent,
			stubs: {
				'font-awesome-icon': true
			},
			mocks: {
				$store,
				$toast
			}
		});

		wrapper.find('a').trigger('click');

		assert.isTrue($toast.info.calledOnce);
		assert.isTrue($toast.info.calledWith('Turning off location service.', '', {
			position: 'bottomCenter'
		}));
		assert.isTrue($store.commit.calledOnce);
		assert.isTrue($store.commit.calledWith('Markers/toggleUserMarker'));
	});

	it('Adds control when created', () => {
		const parent = {
			methods: {
				addObject: sinon.spy()
			}
		};
		const wrapper = shallowMount(UserMarkerControl, {
			parentComponent: parent,
			stubs: {
				'font-awesome-icon': true
			}
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

			stubs: {
				'font-awesome-icon': true
			}
		});

		wrapper.destroy();
		assert.isTrue(parent.methods.removeObject.calledOnce);
		assert.isTrue(parent.methods.removeObject.calledWith(wrapper.vm.mapObject));
	});

});
