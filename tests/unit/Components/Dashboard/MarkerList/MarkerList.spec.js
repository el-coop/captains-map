import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import MarkerList from '@/Components/Dashboard/SideBar/MarkerList';
import sinon from 'sinon';
import Map from '@/Services/LeafletMapService';

const pageSize = parseInt(import.meta.env.VITE_APP_PAGE_SIZE);

describe('MarkerList.vue', () => {
	let mocks;

	beforeEach(() => {
		mocks = {
			$store: {
				state: {
					Markers: {
						markers: [],
						hasNext: false,
						page: 0,
						serverPage: 0
					},
					Stories: {
						story: null
					},
					User: {
						user: {
							id: 1
						}
					}
				},
				getters: {
					'Uploads/allFiles': []
				}
			},
			$router: {
				currentRoute: {
					name: 'edit'
				}
			}
		}
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Renders', () => {
		const wrapper = shallowMount(MarkerList, {
			mocks
		});

		assert.isTrue(wrapper.find('ul').exists());
		assert.isFalse(wrapper.find('.loader').exists());
	});

	it('Shows loader when loading normal markers', () => {
		mocks.$store.state.Markers.loading = true;

		const wrapper = shallowMount(MarkerList, {
			mocks
		});

		assert.isFalse(wrapper.find('ul').exists());
		assert.isTrue(wrapper.find('.is-loading').exists());
	});


	it('Shows loader when loading story markers', () => {
		mocks.$store.state.Markers.loading = false;
		mocks.$store.state.Stories.loading = true;

		const wrapper = shallowMount(MarkerList, {
			mocks
		});

		assert.isFalse(wrapper.find('ul').exists());
		assert.isTrue(wrapper.find('.is-loading').exists());
	});

	it('Renders list of markers and hides pagination when no hasNext', () => {
		mocks.$store.state.Markers.markers = new Array(2).fill({lat: 0, lng: 0});

		const wrapper = shallowMount(MarkerList, {
			mocks
		});

		assert.equal(wrapper.findAll('markerentry-stub').length, 2);
		assert.isFalse(wrapper.findAll('.button').exists());
	});

	it('Renders list of markers and hides pagination when story is chosen', () => {
		mocks.$store.state.Markers.hasNext = true;
		mocks.$store.state.Markers.page = 1;
		mocks.$store.state.Markers.markers = new Array(2).fill({lat: 0, lng: 0});
		mocks.$store.state.Stories.story = 1;
		mocks.$store.state.Stories.markers = new Array(3).fill({lat: 0, lng: 0});

		const wrapper = shallowMount(MarkerList, {
			mocks
		});

		assert.equal(wrapper.findAll('markerentry-stub').length, 3);
		assert.isFalse(wrapper.findAll('.button').exists());
	});

	it('Renders next pagination buttons when there is next', () => {
		mocks.$store.state.Markers.markers = new Array(2).fill({lat: 0, lng: 0});
		mocks.$store.state.Markers.hasNext = true;

		const wrapper = shallowMount(MarkerList, {
			mocks
		});

		assert.equal(wrapper.findAll('markerentry-stub').length, 2);
		assert.equal(wrapper.find('.button').text(), 'Load Next');
	});

	it('Shows previous button when page is 0 and server page is bigger', async () => {
		mocks.$store.state.Markers.markers = new Array(pageSize * 3).fill({lat: 0, lng: 0});
		mocks.$store.state.Markers.hasNext = true;
		mocks.$store.state.Markers.serverPage = 2;

		const wrapper = shallowMount(MarkerList, {
			mocks
		});

		await wrapper.vm.$nextTick();

		assert.equal(wrapper.find('.button').text(), 'Load Previous');
	});

	it('Loads next page', async () => {
		mocks.$store.state.Markers.markers = new Array(pageSize * 3).fill({lat: 0, lng: 0});
		mocks.$store.state.Markers.hasNext = true;
		mocks.$store.state.Markers.page = 1;

		const storeDispatchSpy = sinon.spy();
		sinon.stub(Map, 'setView');
		const $bus = {
			$emit: sinon.spy()
		};
		mocks.$store.dispatch = storeDispatchSpy;
		mocks.$bus = $bus;
		const wrapper = shallowMount(MarkerList, {
			mocks
		});

		await wrapper.vm.nextPage();
		assert.isTrue(storeDispatchSpy.calledOnce);
		assert.isTrue(storeDispatchSpy.calledWith('Markers/nextPage'));
	});

	it('Loads prev page', async () => {
		mocks.$store.state.Markers.markers = new Array(pageSize * 3).fill({lat: 0, lng: 0});
		mocks.$store.state.Markers.hasNext = true;
		mocks.$store.state.Markers.page = 1;

		const storeDispatchSpy = sinon.spy();
		sinon.stub(Map, 'setView');
		const $bus = {
			$emit: sinon.spy()
		};
		mocks.$store.dispatch = storeDispatchSpy;
		mocks.$bus = $bus;
		const wrapper = shallowMount(MarkerList, {
			mocks
		});

		await wrapper.vm.previousPage();
		assert.isTrue(storeDispatchSpy.calledOnce);
		assert.isTrue(storeDispatchSpy.calledWith('Markers/previousPage'));
	});

	it('Calls nextPage on click', () => {
		mocks.$store.state.Markers.markers = new Array(pageSize * 3).fill({lat: 0, lng: 0});
		mocks.$store.state.Markers.hasNext = true;
		mocks.$store.state.Markers.page = 1;

		const nextPageStub = sinon.stub(MarkerList.methods, 'nextPage');
		const wrapper = shallowMount(MarkerList, {
			mocks
		});

		wrapper.findAll('.button').at(1).trigger('click');
		assert.isTrue(nextPageStub.calledOnce);
	});

	it('Calls previousPage on click', () => {
		mocks.$store.state.Markers.markers = new Array(pageSize * 3).fill({lat: 0, lng: 0});
		mocks.$store.state.Markers.hasNext = true;
		mocks.$store.state.Markers.page = 1;

		const previousPageStub = sinon.stub(MarkerList.methods, 'previousPage');
		const wrapper = shallowMount(MarkerList, {
			mocks
		});

		wrapper.findAll('.button').at(0).trigger('click');
		assert.isTrue(previousPageStub.calledOnce);
	});

	it('Shows upload list when there are pending uploads and current route is edit', () => {
		mocks.$store.getters["Uploads/allFiles"] = new Array(pageSize * 3).fill({lat: 0, lng: 0});

		const wrapper = shallowMount(MarkerList, {
			mocks
		});
		assert.isTrue(wrapper.find('uploadslist-stub').exists());
	});

	it('Shows upload list when there are pending uploads and a users story is chosen', () => {
		mocks.$store.getters["Uploads/allFiles"] = new Array(pageSize * 3).fill({lat: 0, lng: 0});
		mocks.$router.currentRoute.name = 'story';
		mocks.$store.state.Stories.story = {
			user_id: 1
		};

		const wrapper = shallowMount(MarkerList, {
			mocks
		});
		assert.isTrue(wrapper.find('uploadslist-stub').exists());
	});

	it('Doesnt show upload list when there are pending uploads and current route is not edit', () => {
		mocks.$store.getters["Uploads/allFiles"] = new Array(pageSize * 3).fill({lat: 0, lng: 0});
		mocks.$router.currentRoute.name = 'view';

		const wrapper = shallowMount(MarkerList, {
			mocks
		});
		assert.isFalse(wrapper.find('uploadslist-stub').exists());
	});

	it('Doesnt Show upload list when there are pending uploads and route is story of other user', () => {
		mocks.$store.getters["Uploads/allFiles"] = new Array(pageSize * 3).fill({lat: 0, lng: 0});
		mocks.$router.currentRoute.name = 'story';
		mocks.$store.state.Stories.story = {
			user_id: 2
		};

		const wrapper = shallowMount(MarkerList, {
			mocks
		});

		assert.isFalse(wrapper.find('uploadslist-stub').exists());
	});
});
