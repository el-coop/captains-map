import { shallowMount,flushPromises } from '@vue/test-utils';
import ViewPage from '@/Views/ViewPage.vue';
import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import map from '@/Services/LeafletMapService';
import sinon from 'sinon';
import router from '@/router';
import LoadsMarkersMixin from "@/Views/LoadsMarkersMixin.vue";
import {createStore} from "vuex";

describe('ViewPage.vue', () => {
	let mocks;
	let storeOptions;

	beforeEach(() => {
		storeOptions = {
			modules: {
				Markers: {
					namespaced: true,
					state: {
						markers: [{
							lat: 1,
							lng: -1
						}]
					},
					actions: {
						load(){
							return {
								status: 200
							}
						}
					},
					mutations: {
						setBorders(){},
						setUser(){},
					}
				},
				User: {
					namespaced: true,
					state: {
						user: null
					}
				},
				Stories: {
					namespaced: true,
					state:{
						story: {
							user_id: 1
						},
						markers: [{
							id: 1,
							lat: 1,
							lng: -1
						}]
					},
					mutations: {
						exit(){}
					},
					actions:{
						load(){}
					}
				},
				Profile:{
					namespaced: true,
					actions: {
						load(){}
					}
				}

			}
		};

		mocks = {
			$route: {
				params: {}
			},
		};
	});


	afterEach(() => {
		sinon.restore();
	});

	it('Renders', () => {
		const loadMarkersSpy = sinon.stub(LoadsMarkersMixin.methods, 'loadMarkers');

		const wrapper = shallowMount(ViewPage, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});

		expect(wrapper.find('.layout').exists()).toBeTruthy();
		expect(wrapper.find('The-Dashboard-stub').exists()).toBeTruthy();
		expect(loadMarkersSpy.calledOnce).toBeTruthy();
	});

	it('Loads Markers', async () => {
		const mapSetViewStub = sinon.stub(map, 'setView');
		const setBordersStub = sinon.stub();
		storeOptions.modules.Markers.mutations.setBorders = setBordersStub;

		const setUserStub = sinon.stub();
		storeOptions.modules.Markers.mutations.setUser = setUserStub;

		const markersLoadStub = sinon.stub().returns({
			status: 200
		});
		storeOptions.modules.Markers.actions.load = markersLoadStub;

		const storiesExitStub = sinon.stub();
		storeOptions.modules.Stories.mutations.exit = storiesExitStub;


		const wrapper = await shallowMount(ViewPage, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});


		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(wrapper.emitted()).toHaveProperty('env-setup');

		expect(setBordersStub.calledWith(sinon.match.any, false)).toBeTruthy();
		expect(setUserStub.calledWith(sinon.match.any, '')).toBeTruthy();
		expect(storiesExitStub.calledWith()).toBeTruthy();

		expect(markersLoadStub.calledWith(sinon.match.any, {
			startingId: false,
			pageIncluding: true
		})).toBeTruthy();

		expect(mapSetViewStub.calledOnce).toBeTruthy();
		expect(mapSetViewStub.calledWith([1, -1])).toBeTruthy();
	});

	it('Loads 404 when response returns 404', async () => {
		const markersLoadStub = sinon.stub().returns({
			status: 404
		});
		storeOptions.modules.Markers.actions.load = markersLoadStub;

		const wrapper = await shallowMount(ViewPage, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(wrapper.emitted()).toHaveProperty('404');

	});

	it('Shows cache toast when loaded from cache', async () => {
		sinon.stub(map, 'setView');

		const markersLoadStub = sinon.stub().returns({
			status: 'cached'
		});
		storeOptions.modules.Markers.actions.load = markersLoadStub;

		mocks.$toast = {
			info: sinon.spy()
		};
		shallowMount(ViewPage, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(mocks.$toast.info.calledOnce).toBeTruthy();
		expect(mocks.$toast.info.calledWith('Markers loaded from cache', '')).toBeTruthy();
	});

	it('Goes to user location when no markers loaded', async () => {
		const goToLocationStub = sinon.stub(map, 'goToCurrentLocation');
		storeOptions.modules.Markers.state.markers = [];
		shallowMount(ViewPage, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(goToLocationStub.calledOnce).toBeTruthy();
	});

	it('Goes to specific marker location when specific in route', async () => {
		const mapSetViewStub = sinon.stub(map, 'setView');
		storeOptions.modules.Markers.state.markers = [{
			id: 1,
			lat: 1,
			lng: 1
		}, {
			id: 2,
			lat: 10,
			lng: 10
		}];

		mocks.$route.params.marker = 2;
		shallowMount(ViewPage, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(mapSetViewStub.calledOnce).toBeTruthy();
		expect(mapSetViewStub.calledWith([10, 10])).toBeTruthy();
	});

	it('Loads 404 when specified marker isnt found', async () => {
		const mapSetViewStub = sinon.stub(map, 'setView');
		storeOptions.modules.Markers.state.markers = [{
			id: 1,
			lat: 1,
			lng: 1
		}, {
			id: 2,
			lat: 10,
			lng: 10
		}];

		mocks.$route.params.marker = 3;
		const wrapper = shallowMount(ViewPage, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(wrapper.emitted()).toHaveProperty('404');
		expect(mapSetViewStub.called).toBeFalsy();
	});

	it('Sets username when specified', async () => {
		storeOptions.modules.Markers.state.markers = [{
			id: 1,
			lat: 1,
			lng: 1
		}, {
			id: 2,
			lat: 10,
			lng: 10
		}];
		sinon.stub(map, 'setView');
		const setBordersStub = sinon.stub();
		storeOptions.modules.Markers.mutations.setBorders = setBordersStub;

		const setUserStub = sinon.stub();
		storeOptions.modules.Markers.mutations.setUser = setUserStub;

		const markersLoadStub = sinon.stub().returns({
			status: 200
		});
		storeOptions.modules.Markers.actions.load = markersLoadStub;

		const storiesExitStub = sinon.stub();
		storeOptions.modules.Stories.mutations.exit = storiesExitStub;


		const profileLoadStub = sinon.stub();
		storeOptions.modules.Profile.actions.load = profileLoadStub;

		mocks.$route.params.username = 'test';

		shallowMount(ViewPage, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(setBordersStub.calledWith(sinon.match.any, false)).toBeTruthy();
		expect(setUserStub.calledWith(sinon.match.any, 'test')).toBeTruthy();
		expect(storiesExitStub.calledWith()).toBeTruthy();

		expect(markersLoadStub.calledWith(sinon.match.any, {
			startingId: false,
			pageIncluding: true
		})).toBeTruthy();

		expect(profileLoadStub.calledWith()).toBeTruthy();

	});

	it('Reloads markers when route changes', async () => {
		const loadMarkersSpy = sinon.stub(LoadsMarkersMixin.methods, 'loadMarkers');
		delete mocks.$route;

		router.push('/test');

		await router.isReady();

		const wrapper = await shallowMount(ViewPage, {
			global: {
				plugins: [createStore(storeOptions), router],
				mocks
			}
		});

		router.push('/test1');
		await flushPromises()

		expect(loadMarkersSpy.calledTwice).toBeTruthy();
	});
});
