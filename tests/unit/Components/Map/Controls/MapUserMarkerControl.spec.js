import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import {shallowMount} from '@vue/test-utils';
import UserMarkerControl from '@/Components/Map/Controls/MapUserMarkerControl.vue';
import sinon from 'sinon';
import {createStore} from "vuex";

describe('MapUserMarkerControl.vue', () => {

	let storeOptions;
	let mocks;
	const stubs = {
		FontAwesomeIcon: true
	};

	beforeEach(() => {
		mocks = {};
		storeOptions = {
			modules: {
				Markers: {
					namespaced: true,
					state: {
						userMarker: false
					},
					actions: {
						toggleUserMarker(){}
					}
				}
			}
		};
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Renders', () => {
		const wrapper = shallowMount(UserMarkerControl, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
			},
		});

		expect(wrapper.find('.leaflet-bar.leaflet-control').exists()).toBeTruthy();
		expect(wrapper.find('.active').exists()).toBeFalsy();
	});


	it('Puts active class when turned on', () => {
		storeOptions.modules.Markers.state.userMarker = true;

		const wrapper = shallowMount(UserMarkerControl, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
			},
		});

		expect(wrapper.find('.map__user-marker-control--active').exists()).toBeTruthy();
	});

	it('Toggles on user marker on click', async () => {
		const toggleUserMarkerStub = sinon.stub();
		storeOptions.modules.Markers.actions.toggleUserMarker = toggleUserMarkerStub;
		mocks.$toast = {
			info: sinon.spy()
		};

		const wrapper = shallowMount(UserMarkerControl, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			},
		});

		wrapper.find('a').trigger('click');

		expect(mocks.$toast.info.calledOnce).toBeTruthy();
		expect(mocks.$toast.info.calledWith('Calculating location, please wait.', '')).toBeTruthy();
		expect(toggleUserMarkerStub.calledOnce).toBeTruthy();
		expect(toggleUserMarkerStub.calledWith()).toBeTruthy();

	});

	it('Toggles off user marker on click', () => {
		mocks.$toast = {
			info: sinon.spy()
		};
		storeOptions.modules.Markers.state.userMarker = true;
		const toggleUserMarkerStub = sinon.stub();
		storeOptions.modules.Markers.actions.toggleUserMarker = toggleUserMarkerStub;

		const wrapper = shallowMount(UserMarkerControl, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			},
		});

		wrapper.find('a').trigger('click');

		expect(mocks.$toast.info.calledOnce).toBeTruthy();
		expect(mocks.$toast.info.calledWith('Turning off location service.', '')).toBeTruthy();
		expect(toggleUserMarkerStub.calledOnce).toBeTruthy();
		expect(toggleUserMarkerStub.calledWith()).toBeTruthy();
	});

	it('Adds control when created', () => {
		const wrapper = shallowMount(UserMarkerControl, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			},
		});

		expect(wrapper.emitted()).toHaveProperty('add-to-map');
	});

	it('Removes control when destroyed', () => {
		const wrapper = shallowMount(UserMarkerControl, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			},
		});

		wrapper.unmount();
		expect(wrapper.emitted()).toHaveProperty('remove-from-map');
	});

	it('Fires go to marker event when right clicked and user marker is on', () => {
		storeOptions.modules.Markers.state.userMarker = true;

		const wrapper = shallowMount(UserMarkerControl, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			},
		});
		wrapper.find('a').trigger('contextmenu');

		expect(wrapper.emitted()).toHaveProperty('go-to-user-marker');

	});

	it('Doesnt fire go to marker event when right clicked and user marker is off', () => {
		const wrapper = shallowMount(UserMarkerControl, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			},
		});
		wrapper.find('a').trigger('contextmenu');

		expect(wrapper.emitted()).not.toHaveProperty('go-to-user-marker');

	});
});
