import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import {shallowMount} from '@vue/test-utils';
import MarkerList from '@/Components/Dashboard/SideBar/MarkerList.vue';
import sinon from 'sinon';
import {createStore} from "vuex";

const pageSize = parseInt(import.meta.env.VITE_APP_PAGE_SIZE);

describe('MarkerList.vue', () => {
	let storeOptions;
	let mocks;

	beforeEach(() => {
		storeOptions = {
			modules: {
				Markers: {
					namespaced: true,
					state: {
						markers: [],
						hasNext: false,
						page: 0,
						serverPage: 0
					},
					actions: {
						nextPage() {
						},
						previousPage() {
						}
					}
				},
				Stories: {
					namespaced: true,
					state: {
						story: null,
						markers: [],
						loading: false,
					},

				},
				Uploads: {
					namespaced: true,
					getters: {
						allFiles(state) {
							return [];
						}
					},
				},
				User: {
					state: {
						user: {
							id: 1
						}
					}
				}
			}

		};

		mocks = {
			$route: {
				name: 'edit'
			}
		}
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Renders', () => {
		const wrapper = shallowMount(MarkerList, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});

		expect(wrapper.find('ul').exists()).toBeTruthy();
		expect(wrapper.find('.loader').exists()).toBeFalsy();
	});

	it('Shows loader when loading normal markers', () => {
		storeOptions.modules.Markers.state.loading = true;

		const wrapper = shallowMount(MarkerList, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});

		expect(wrapper.find('ul').exists()).toBeFalsy();
		expect(wrapper.find('.is-loading').exists()).toBeTruthy();
	});


	it('Shows loader when loading story markers', () => {
		storeOptions.modules.Markers.state.loading = false;
		storeOptions.modules.Stories.state.loading = true;

		const wrapper = shallowMount(MarkerList, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});

		expect(wrapper.find('ul').exists()).toBeFalsy();
		expect(wrapper.find('.is-loading').exists()).toBeTruthy();
	});

	it('Renders list of markers and hides pagination when no hasNext', () => {
		storeOptions.modules.Markers.state.markers = new Array(2).fill({lat: 0, lng: 0});

		const wrapper = shallowMount(MarkerList, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});

		expect(wrapper.findAll('marker-entry-stub').length).toBe(2);
		expect(wrapper.find('.button').exists()).toBeFalsy();
	});

	it('Renders list of markers and hides pagination when story is chosen', () => {
		storeOptions.modules.Markers.state.hasNext = true;
		storeOptions.modules.Markers.state.page = 1;
		storeOptions.modules.Markers.state.markers = new Array(2).fill({lat: 0, lng: 0});

		storeOptions.modules.Stories.state.story = 1;
		storeOptions.modules.Stories.state.markers = new Array(3).fill({lat: 0, lng: 0});

		const wrapper = shallowMount(MarkerList, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});

		expect(wrapper.findAll('marker-entry-stub').length).toBe(3);
		expect(wrapper.find('.button').exists()).toBeFalsy();

	});

	it('Renders next pagination buttons when there is next', () => {
		storeOptions.modules.Markers.state.markers = new Array(2).fill({lat: 0, lng: 0});
		storeOptions.modules.Markers.state.hasNext = true;

		const wrapper = shallowMount(MarkerList, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});

		expect(wrapper.findAll('marker-entry-stub').length).toBe(2);
		expect(wrapper.find('.button').text()).toBe('Load Next');
	});

	it('Shows previous button when page is 0 and server page is bigger', async () => {
		storeOptions.modules.Markers.state.markers = new Array(pageSize * 3).fill({lat: 0, lng: 0});
		storeOptions.modules.Markers.state.hasNext = true;
		storeOptions.modules.Markers.state.serverPage = 2;

		const wrapper = shallowMount(MarkerList, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});

		await wrapper.vm.$nextTick();

		expect(wrapper.find('.button').text()).toBe('Load Previous');
	});

	it('Loads next page', async () => {
		const nextPageStub = sinon.spy();

		storeOptions.modules.Markers.state.markers = new Array(pageSize * 3).fill({lat: 0, lng: 0});
		storeOptions.modules.Markers.state.hasNext = true;
		storeOptions.modules.Markers.state.page = 1;
		storeOptions.modules.Markers.actions.nextPage = nextPageStub;

		const wrapper = shallowMount(MarkerList, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});

		await wrapper.vm.nextPage();
		expect(nextPageStub.calledOnce).toBeTruthy();
	});

	it('Loads prev page', async () => {
		const prevPageStub = sinon.spy();

		storeOptions.modules.Markers.state.markers = new Array(pageSize * 3).fill({lat: 0, lng: 0});
		storeOptions.modules.Markers.state.hasNext = true;
		storeOptions.modules.Markers.state.page = 1;
		storeOptions.modules.Markers.actions.previousPage = prevPageStub;

		const wrapper = shallowMount(MarkerList, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});

		await wrapper.vm.previousPage();
		expect(prevPageStub.calledOnce).toBeTruthy();

	});

	it('Calls nextPage on click', () => {
		storeOptions.modules.Markers.state.markers = new Array(pageSize * 3).fill({lat: 0, lng: 0});
		storeOptions.modules.Markers.state.hasNext = true;
		storeOptions.modules.Markers.state.page = 1;

		const nextPageStub = sinon.stub(MarkerList.methods, 'nextPage');
		const wrapper = shallowMount(MarkerList, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});


		wrapper.findAll('.button').at(1).trigger('click');
		expect(nextPageStub.calledOnce).toBeTruthy();
	});

	it('Calls previousPage on click', () => {
		storeOptions.modules.Markers.state.markers = new Array(pageSize * 3).fill({lat: 0, lng: 0});
		storeOptions.modules.Markers.state.hasNext = true;
		storeOptions.modules.Markers.state.page = 1;

		const previousPageStub = sinon.stub(MarkerList.methods, 'previousPage');
		const wrapper = shallowMount(MarkerList, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});

		wrapper.findAll('.button').at(0).trigger('click');
		expect(previousPageStub.calledOnce).toBeTruthy();
	});

	it('Shows upload list when there are pending uploads and current route is edit', () => {
		storeOptions.modules.Uploads.getters.allFiles = (state) => {
			return new Array(pageSize * 3).fill({lat: 0, lng: 0});
		};

		const wrapper = shallowMount(MarkerList, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});

		expect(wrapper.find('uploads-list-stub').exists()).toBeTruthy();
	});

	it('Shows upload list when there are pending uploads and a users story is chosen', () => {
		storeOptions.modules.Uploads.getters.allFiles = (state) => {
			return new Array(pageSize * 3).fill({lat: 0, lng: 0});
		};
		storeOptions.modules.Stories.state.story = {
			user_id: 1
		};
		mocks.$route.name = 'story';

		const wrapper = shallowMount(MarkerList, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});

		expect(wrapper.find('uploads-list-stub').exists()).toBeTruthy();
	});

	it('Doesnt show upload list when there are pending uploads and current route is not edit', () => {
		storeOptions.modules.Uploads.getters.allFiles = (state) => {
			return new Array(pageSize * 3).fill({lat: 0, lng: 0});
		};
		mocks.$route.name = 'view';

		const wrapper = shallowMount(MarkerList, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});
		expect(wrapper.find('uploads-list-stub').exists()).toBeFalsy();
	});

	it('Doesnt Show upload list when there are pending uploads and route is story of other user', () => {
		storeOptions.modules.Uploads.getters.allFiles = (state) => {
			return new Array(pageSize * 3).fill({lat: 0, lng: 0});
		};
		mocks.$route.name = 'story';
		storeOptions.modules.Stories.state.story = {
			user_id: 2
		};

		const wrapper = shallowMount(MarkerList, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});

		expect(wrapper.find('uploads-list-stub').exists()).toBeFalsy();
	});

	it('Doesnt Show story upload list when there are pending uploads and route is not story', () => {
		storeOptions.modules.Uploads.getters.allFiles = (state) => {
			return new Array(pageSize * 3).fill({lat: 0, lng: 0, story: 1});
		};
		mocks.$route.name = 'edit';

		const wrapper = shallowMount(MarkerList, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});

		expect(wrapper.find('uploads-list-stub').exists()).toBeFalsy();
	});

	it('Doesnt Show story upload list when there are pending uploads and route is a different story story', () => {
		storeOptions.modules.Uploads.getters.allFiles = (state) => {
			return new Array(pageSize * 3).fill({lat: 0, lng: 0, story: 1});
		};
		storeOptions.modules.Stories.state.story = {
			user_id: 1,
			id: 2
		};

		const wrapper = shallowMount(MarkerList, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});

		expect(wrapper.find('uploads-list-stub').exists()).toBeFalsy();
	});

	it('Shows story upload list when there are pending uploads and route is same story', () => {
		storeOptions.modules.Uploads.getters.allFiles = (state) => {
			return new Array(pageSize * 3).fill({lat: 0, lng: 0, story: 1});
		};
		storeOptions.modules.Stories.state.story = {
			user_id: 1,
			id: 1
		};

		const wrapper = shallowMount(MarkerList, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks
			}
		});

		expect(wrapper.find('uploads-list-stub').exists()).toBeTruthy();
	});
})
