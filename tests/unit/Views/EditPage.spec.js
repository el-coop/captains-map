import {shallowMount} from '@vue/test-utils';
import EditPage from '@/Views/EditPage.vue';
import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import sinon from "sinon";
import map from "@/Services/LeafletMapService";
import {createStore} from "vuex";
import LoadsMarkersMixin from "@/Views/LoadsMarkersMixin.vue";

describe('EditPage.vue', () => {
	let goToCurrentLocationStub;
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
						user: {
							username: 'test'
						}
					}
				},
				Stories: {
					namespaced: true,
					mutations: {
						exit(){}
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

		goToCurrentLocationStub = sinon.stub(map, 'goToCurrentLocation');
	});


	afterEach(() => {
		sinon.restore();
	});

	it('renders', () => {
		const loadMarkersSpy = sinon.stub(LoadsMarkersMixin.methods, 'loadMarkers');

		const wrapper = shallowMount(EditPage, {
			global: {
				plugins: [createStore(storeOptions)]
			},
		});

		expect(wrapper.find('.layout').exists()).toBeTruthy();
		expect(wrapper.find('the-dashboard-stub').exists()).toBeTruthy();
		expect(wrapper.find('create-marker-stub').exists()).toBeTruthy();
		expect(loadMarkersSpy.calledOnce).toBeTruthy();
	});

	it('Loads Markers', async () => {
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

		const wrapper = await shallowMount(EditPage, {
			global: {
				plugins: [createStore(storeOptions)]
			},
		});

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(wrapper.emitted()).toHaveProperty('env-setup');

		expect(setBordersStub.calledWith(sinon.match.any, false)).toBeTruthy();
		expect(setUserStub.calledWith(sinon.match.any, 'test')).toBeTruthy();
		expect(storiesExitStub.calledWith()).toBeTruthy();

		expect(markersLoadStub.calledWith()).toBeTruthy();
		expect(profileLoadStub.calledWith()).toBeTruthy();

		expect(goToCurrentLocationStub.calledOnce).toBeTruthy();
		expect(goToCurrentLocationStub.calledWith()).toBeTruthy();
	});

	it('Shows cache toast when loaded from cache', async () => {
		const markersLoadStub = sinon.stub().returns({
			status: 'cached'
		});
		storeOptions.modules.Markers.actions.load = markersLoadStub;

		const mocks = {
			$toast: {
				info: sinon.spy()
			}
		};
		await shallowMount(EditPage, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			},
		});

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(mocks.$toast.info.calledOnce).toBeTruthy();
		expect(mocks.$toast.info.calledWith('Markers loaded from cache', '')).toBeTruthy();
	});

});
