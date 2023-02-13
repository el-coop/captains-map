import { shallowMount } from '@vue/test-utils';
import StoryPage from '@/Views/StoryPage.vue';
import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import map from '@/Services/LeafletMapService';
import sinon from 'sinon';
import {createStore} from "vuex";

describe('StoryPage.vue', () => {
	let mocks;
	let storeOptions;

	beforeEach(() => {
		global.window.addEventListener = sinon.stub();
		global.window.removeEventListener = sinon.stub();

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
				params: {
					story: 1
				}
			},
		};
	});


	afterEach(() => {
		delete global.window.addEventListener;
		delete global.window.removeEventListener;

		sinon.restore();
	});

	it('Registers and destroys window pop state event', () => {

		const wrapper = shallowMount(StoryPage, {
			global: {
				plugins:[createStore(storeOptions)],
				mocks
			}
		});

		expect(global.window.addEventListener.calledOnce).toBeTruthy();
		expect(global.window.addEventListener.calledWith('popstate')).toBeTruthy();

		wrapper.unmount();

		expect(global.window.removeEventListener.calledOnce).toBeTruthy();
		expect(global.window.removeEventListener.calledWith('popstate')).toBeTruthy();


	});

	it('Renders without create marker when no logged in user', () => {
		sinon.stub(map, 'setView');
		const storiesLoadStub = sinon.stub();
		storeOptions.modules.Stories.actions.load = storiesLoadStub;

		const wrapper = shallowMount(StoryPage, {
			global: {
				plugins:[createStore(storeOptions)],
				mocks
			}
		});

		expect(wrapper.find('.layout').exists()).toBeTruthy();
		expect(wrapper.find('The-Dashboard-stub').exists()).toBeTruthy();
		expect(wrapper.find('Create-Marker-stub').exists()).toBeFalsy();
		expect(storiesLoadStub.calledOnce).toBeTruthy();
		expect(storiesLoadStub.calledWith(sinon.match.any, {
			user: mocks.$route.params.username,
			storyId: mocks.$route.params.story,
		})).toBeTruthy();
	});


	it('Renders without create marker when user didnt create story', () => {
		sinon.stub(map, 'setView');
		const storiesLoadStub = sinon.stub();
		storeOptions.modules.Stories.actions.load = storiesLoadStub;

		storeOptions.modules.User.state.user = {
			id: 2
		};
		const wrapper = shallowMount(StoryPage, {
			global: {
				plugins:[createStore(storeOptions)],
				mocks
			}

		});

		expect(wrapper.find('.layout').exists()).toBeTruthy();
		expect(wrapper.find('The-Dashboard-stub').exists()).toBeTruthy();
		expect(wrapper.find('Create-Marker-stub').exists()).toBeFalsy();
		expect(storiesLoadStub.calledOnce).toBeTruthy();
		expect(storiesLoadStub.calledWith(sinon.match.any, {
			user: mocks.$route.params.username,
			storyId: mocks.$route.params.story,
		})).toBeTruthy();

	});

	it('Renders with create marker when user created story', () => {
		sinon.stub(map, 'setView');
		const storiesLoadStub = sinon.stub();
		storeOptions.modules.Stories.actions.load = storiesLoadStub;
		storeOptions.modules.User.state.user = {
			id: 1
		};
		const wrapper = shallowMount(StoryPage, {
			global: {
				plugins:[createStore(storeOptions)],
				mocks
			}
		});

		expect(wrapper.find('.layout').exists()).toBeTruthy();
		expect(wrapper.find('The-Dashboard-stub').exists()).toBeTruthy();
		expect(wrapper.find('Create-Marker-stub').exists()).toBeTruthy();
		expect(storiesLoadStub.calledOnce).toBeTruthy();
		expect(storiesLoadStub.calledWith(sinon.match.any, {
			user: mocks.$route.params.username,
			storyId: mocks.$route.params.story,
		})).toBeTruthy();

	});

	it('Loads Markers', async () => {
		const mapSetViewStub = sinon.stub(map, 'setView');
		const storiesLoadStub = sinon.stub();
		storeOptions.modules.Stories.actions.load = storiesLoadStub;
		const wrapper = await shallowMount(StoryPage, {
			global: {
				plugins:[createStore(storeOptions)],
				mocks
			}
		});

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(wrapper.emitted()).toHaveProperty('env-setup');

		expect(storiesLoadStub.calledOnce).toBeTruthy();
		expect(storiesLoadStub.calledWith(sinon.match.any, {
			user: mocks.$route.params.username,
			storyId: mocks.$route.params.story,
		})).toBeTruthy();

		expect(mapSetViewStub.calledOnce).toBeTruthy();
		expect(mapSetViewStub.calledWith([1, -1])).toBeTruthy();

	});

	it('Loads 404 when response returns 404', async () => {
		const storiesLoadStub = sinon.stub().returns(404);
		storeOptions.modules.Stories.actions.load = storiesLoadStub;

		const wrapper = await shallowMount(StoryPage, {
			global: {
				plugins:[createStore(storeOptions)],
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
		const storiesLoadStub = sinon.stub().returns('cached');
		storeOptions.modules.Stories.actions.load = storiesLoadStub;

		mocks.$toast = {
			info: sinon.spy()
		};
		await shallowMount(StoryPage, {
			global: {
				plugins:[createStore(storeOptions)],
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


	it('Loads 404 when specified marker isnt found', async () => {
		const mapSetViewStub = sinon.stub(map, 'setView');
		storeOptions.modules.Stories.state.markers = [{
			id: 1,
			lat: 1,
			lng: 1
		}, {
			id: 2,
			lat: 10,
			lng: 10
		}];

		mocks.$route.params.marker = 3;
		const wrapper = await shallowMount(StoryPage, {
			global: {
				plugins:[createStore(storeOptions)],
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

	it('Sets view to specific marker when it is found', async () => {
		const mapSetViewStub = sinon.stub(map, 'setView');
		storeOptions.modules.Stories.state.markers = [{
			id: 1,
			lat: 1,
			lng: 1
		}, {
			id: 2,
			lat: 10,
			lng: 10
		}];

		mocks.$route.params.marker = 2;
		await shallowMount(StoryPage, {
			global: {
				plugins:[createStore(storeOptions)],
				mocks
			}
		});

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(mapSetViewStub.called).toBeTruthy();
		expect(mapSetViewStub.calledWith([
			10, 10
		])).toBeTruthy();
	})

	it('Sets view to specific marker when backed/forwarded into it', async () => {
		const mapSetViewStub = sinon.stub(map, 'setView');
		storeOptions.modules.Stories.state.markers = [{
			id: 1,
			lat: 1,
			lng: 1
		}, {
			id: 2,
			lat: 10,
			lng: 10
		}];

		mocks.$route.params.marker = 2;
		const wrapper = await shallowMount(StoryPage, {
			global: {
				plugins:[createStore(storeOptions)],
				mocks
			}
		});

		wrapper.vm.findMarker();

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(mapSetViewStub.calledTwice).toBeTruthy();
		expect(mapSetViewStub.secondCall.calledWith([
			10, 10
		])).toBeTruthy();
	})

});
