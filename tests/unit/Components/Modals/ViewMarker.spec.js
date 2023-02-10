import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import {shallowMount, mount} from '@vue/test-utils';
import ViewMarker from '@/Components/Modals/ViewMarker.vue';
import ViewMarkerHeader from "@/Components/Modals/ViewMarker/Header.vue";
import sinon from 'sinon';
import {createStore} from "vuex";

describe('ViewMarker.vue', () => {
	let marker;
	const stubs = {
		ViewMarkerHeader: true,
		ViewMarkerContent: true,
		Photo: true,
		FontAwesomeIcon: true,
		Instagram: true
	};

	let mocks;
	let storeOptions;


	beforeEach(() => {
		storeOptions = {
			modules: {
				User: {
					namespaced: true,
					state: {
						user: null
					}
				},
				Markers: {
					namespaced: true,
					actions: {
						delete(){}
					}
				}
			}
		};
		marker = {
			id: 1,
			user_id: 1,
			user: {
				username: 'test',
			},
			media: [{
				type: 'image',
				path: 'test',
				id: 1
			}]
		};
		mocks = {
			$router: {
				pushRoute: sinon.stub(),
				replaceRoute: sinon.stub(),
				push: sinon.stub(),

			},
			$route: {
				params: {},
				path: '/'
			},
			$toast: {
				error: sinon.spy()
			}
		};
	});

	afterEach(() => {
		sinon.restore();
	});


	it('Renders with photo content', async () => {
		const wrapper = mount(ViewMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: true,
			marker
		});

		expect(wrapper.find('.modal').exists()).toBeTruthy();
		expect(wrapper.find('view-marker-header-stub').exists()).toBeTruthy();
		expect(wrapper.find('view-marker-content-stub').exists()).toBeTruthy();
		expect(wrapper.find('photo-stub').exists()).toBeTruthy();
	});

	it('Renders pagination when there are multiple media and selected media', async () => {
		marker.media = [{
			type: 'image',
			path: 'test',
			id: 1
		}, {
			type: 'image',
			path: 'test',
			id: 2
		}];

		const wrapper = mount(ViewMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: true,
			currentMedia: 1,
			marker
		});

		expect(wrapper.find('.modal').exists()).toBeTruthy();
		expect(wrapper.find('view-marker-header-stub').exists()).toBeTruthy();
		expect(wrapper.find('view-marker-content-stub').exists()).toBeTruthy();
		expect(wrapper.find('photo-stub[id="1"]').exists()).toBeFalsy();
		expect(wrapper.find('photo-stub[id="2"]').exists()).toBeTruthy();
		expect(wrapper.find('.click-pagination').exists()).toBeTruthy();
	});


	it('Renders with instagram content', async () => {
		marker.media[0].type = 'instagram';
		const wrapper = mount(ViewMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}

		});
		await wrapper.setData({
			modal: true,
			marker
		});
		expect(wrapper.find('.modal').exists());
		expect(wrapper.find('view-marker-header-stub').exists()).toBeTruthy();
		expect(wrapper.find('view-marker-content-stub').exists()).toBeTruthy();
		expect(wrapper.find('instagram-stub').exists()).toBeTruthy();
	});

	it('doesnt render when modal not active', async () => {
		const wrapper = mount(ViewMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});
		await wrapper.setData({
			modal: false,
			marker
		});
		expect(wrapper.find('.modal').exists()).toBeTruthy();
		expect(wrapper.find('view-marker-header-stub').exists()).toBeFalsy();
		expect(wrapper.find('view-marker-content-stub').exists()).toBeFalsy();
	});

	it('Shows delete button for markers user', async () => {
		storeOptions.modules.User.state.user = {
			id: 1
		};
		const wrapper = mount(ViewMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: true,
			marker
		});

		expect(wrapper.find('button.is-danger-background').exists()).toBeTruthy();
	});

	it('Doesnt show delete button for different user', async () => {

		const wrapper = shallowMount(ViewMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: true,
			marker
		});

		expect(wrapper.find('button.is-danger').exists()).toBeFalsy();
	});

	it('Closes modal with close button', async () => {
		const wrapper = mount(ViewMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: true,
			marker
		});

		wrapper.find('.card__footer-item a').trigger('click');

		expect(wrapper.vm.$data.modal).toBeFalsy();
	});

	it('Calculates route name', async () => {
		const wrapper = shallowMount(ViewMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: true,
			marker
		});

		expect(wrapper.vm.routeName).toBe('test/1');
	});

	it('Calculates route name with story', async () => {
		mocks.$route.params.story = 1;
		const wrapper = shallowMount(ViewMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: true,
			marker
		});

		expect(wrapper.vm.routeName).toBe('test/story/1/1');
	});

	it('Shows marker', async () => {
		const wrapper = shallowMount(ViewMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: false,
		});

		await wrapper.vm.showMarker(marker);

		expect(wrapper.vm.$data.modal).toBeTruthy();
		expect(wrapper.vm.$data.marker).toEqual(marker);
	});

	it('Shows marker with pagination hint when album', async () => {
		marker.media = [{
			type: 'image',
			path: 'test',
			id: 1
		}, {
			type: 'image',
			path: 'test1',
			id: 2
		}];
		const wrapper = shallowMount(ViewMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: false,
		});

		wrapper.vm.showMarker(marker);

		expect(wrapper.vm.$data.modal).toBeTruthy();
		expect(wrapper.vm.$data.marker).toEqual(marker);
		expect(wrapper.vm.$data.showAlbumHint).toBeTruthy();

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 1510);
		});

		expect(wrapper.vm.$data.showAlbumHint).toBeFalsy();

	});

	it('Deletes marker', async () => {
		const deleteStub = sinon.stub().returns(true);
		storeOptions.modules.Markers.actions.delete = deleteStub;

		const wrapper = shallowMount(ViewMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: true,
			marker
		});

		await wrapper.vm.deleteMarker();

		expect(deleteStub.calledOnce).toBeTruthy();
		expect(deleteStub.calledWith(sinon.match.any, {id: 1, story: null})).toBeTruthy();

		expect(wrapper.vm.$data.modal).toBeFalsy();
	});

	it('Shows toast when deleteing a marker fails', async () => {

		const deleteStub = sinon.stub().returns(false);
		storeOptions.modules.Markers.actions.delete = deleteStub;

		const wrapper = shallowMount(ViewMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: true,
			marker
		});

		await wrapper.vm.deleteMarker();

		expect(deleteStub.calledOnce).toBeTruthy();
		expect(deleteStub.calledWith(sinon.match.any, {id: 1, story: null})).toBeTruthy();
		expect(mocks.$toast.error.calledOnce).toBeTruthy();
		expect(mocks.$toast.error.calledWith('Please try again at a later time', 'Delete failed.')).toBeTruthy();
	});

	it('Calls with delete with story when in story page', async () => {
		mocks.$route.params.story = 1;
		const deleteStub = sinon.stub().returns(true);
		storeOptions.modules.Markers.actions.delete = deleteStub;

		const wrapper = shallowMount(ViewMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: true,
			marker
		});

		await wrapper.vm.deleteMarker();

		expect(deleteStub.calledOnce).toBeTruthy();
		expect(deleteStub.calledWith(sinon.match.any, {id: 1, story: 1})).toBeTruthy();
		expect(wrapper.vm.$data.modal).toBeFalsy();
	});

	it('Closes modal and enables user navigation flag', async () => {
		const wrapper = mount(ViewMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: true,
			marker
		});

		wrapper.findComponent(ViewMarkerHeader).vm.$emit('view-user-page');

		expect(wrapper.vm.$data.modal).toBeFalsy();
		expect(wrapper.vm.$data.userNavigation).toBeTruthy();
	});

	it('Changes media', async () => {
		marker.media = [{
			type: 'image',
			path: 'test',
			id: 1
		}, {
			type: 'image',
			path: 'test',
			id: 2
		}];

		const wrapper = mount(ViewMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: true,
			marker
		});
		expect(wrapper.find('photo-stub[id="1"]').exists()).toBeTruthy();
		expect(wrapper.find('photo-stub[id="2"]').exists()).toBeFalsy();
		expect(wrapper.vm.$data.currentMedia).toBe(0);

		wrapper.vm.changeMedia(1);
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(wrapper.find('photo-stub[id="1"]').exists()).toBeFalsy();
		expect(wrapper.find('photo-stub[id="2"]').exists()).toBeTruthy();
		expect(wrapper.vm.$data.currentMedia).toBe(1);

		wrapper.vm.changeMedia(-1);
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(wrapper.find('photo-stub[id="1"]').exists()).toBeTruthy();
		expect(wrapper.find('photo-stub[id="2"]').exists()).toBeFalsy();
		expect(wrapper.vm.$data.currentMedia).toBe(0);

		wrapper.vm.changeMedia(-1);
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(wrapper.find('photo-stub[id="1"]').exists()).toBeFalsy();
		expect(wrapper.find('photo-stub[id="2"]').exists()).toBeTruthy();
		expect(wrapper.vm.$data.currentMedia).toBe(1);

		wrapper.vm.changeMedia(1);
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(wrapper.find('photo-stub[id="1"]').exists()).toBeTruthy();
		expect(wrapper.find('photo-stub[id="2"]').exists()).toBeFalsy();
		expect(wrapper.vm.$data.currentMedia).toBe(0);
	});

	it('Navigates to user when flag is true and modal is closed', async () => {
		const wrapper = mount(ViewMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: true,
			marker,
			userNavigation: true
		});

		wrapper.vm.closedNavigation();

		expect(mocks.$router.push.calledOnce).toBeTruthy();
		expect(mocks.$router.push.calledWith('/test')).toBeTruthy();
		expect(wrapper.vm.$data.userNavigation).toBeFalsy();
	});

	it('Navigates back to story when it was loaded before', async () => {
		mocks.$route.params.username = 'test';
		mocks.$route.params.story = 1;
		const wrapper = mount(ViewMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: true,
			marker,
		});

		wrapper.vm.closedNavigation({
			back:false
		});

		expect(mocks.$router.replaceRoute.calledOnce).toBeTruthy();
		expect(mocks.$router.replaceRoute.calledWith('test/story/1')).toBeTruthy();
	});

	it('Doesnt navigates back to story when back button is called', async () => {
		mocks.$route.params.username = 'test';
		mocks.$route.params.story = 1;
		const wrapper = mount(ViewMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: true,
			marker,
		});

		wrapper.vm.closedNavigation({
			back: true
		});

		expect(mocks.$router.replaceRoute.notCalled).toBeTruthy();
	});

	it('Navigates back to story when back button is called but back has marker as well', async () => {
		mocks.$route.params.username = 'test';
		mocks.$route.params.story = 1;
		mocks.$route.params.marker = marker.id;
		const wrapper = mount(ViewMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: true,
			marker,
		});

		wrapper.vm.closedNavigation({
			back: true
		});

		expect(mocks.$router.replaceRoute.calledOnce).toBeTruthy();
		expect(mocks.$router.replaceRoute.calledWith('test/story/1')).toBeTruthy();
	});

	it('Navigates back to user when it was loaded before', async () => {
		mocks.$route.params.username = 'test';
		const wrapper = mount(ViewMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: true,
			marker,
		});

		wrapper.vm.closedNavigation();

		expect(mocks.$router.pushRoute.calledTwice).toBeTruthy();
		expect(mocks.$router.pushRoute.secondCall.calledWith('test')).toBeTruthy();
	});

	it('Navigates back to previous url if there was no user before', async () => {
		mocks.$route.path = 'edit';
		const wrapper = mount(ViewMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: true,
			marker,
		});

		wrapper.vm.closedNavigation();

		expect(mocks.$router.pushRoute.calledTwice).toBeTruthy();
		expect(mocks.$router.pushRoute.secondCall.calledWith('edit')).toBeTruthy();
	});

	it('Displays pagination indicators', async () => {
		marker.media = [{
			type: 'image',
			path: 'test',
			id: 1
		}, {
			type: 'image',
			path: 'test1',
			id: 2
		}, {
			type: 'image',
			path: 'test2',
			id: 3
		}];

		const wrapper = mount(ViewMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: true,
			marker
		});

		const indicators = wrapper.findAll('.pagination-indicators__indicator');

		expect(wrapper.find('.pagination-indicators').exists()).toBeTruthy();
		expect(indicators.length).toBe(3);

		expect(wrapper.find('photo-stub[id="1"]').exists()).toBeTruthy();
		expect(wrapper.find('photo-stub[id="2"]').exists()).toBeFalsy();
		expect(wrapper.find('photo-stub[id="3"]').exists()).toBeFalsy();
		expect(wrapper.vm.$data.currentMedia).toBe(0);

		indicators.at(1).trigger('click');
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});
		expect(wrapper.find('photo-stub[id="1"]').exists()).toBeFalsy();
		expect(wrapper.find('photo-stub[id="2"]').exists()).toBeTruthy();
		expect(wrapper.find('photo-stub[id="3"]').exists()).toBeFalsy();
		expect(wrapper.vm.$data.currentMedia).toBe(1);

		indicators.at(2).trigger('click');
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});
		expect(wrapper.find('photo-stub[id="1"]').exists()).toBeFalsy();
		expect(wrapper.find('photo-stub[id="2"]').exists()).toBeFalsy();
		expect(wrapper.find('photo-stub[id="3"]').exists()).toBeTruthy();
		expect(wrapper.vm.$data.currentMedia).toBe(2);

		indicators.at(0).trigger('click');
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});
		expect(wrapper.find('photo-stub[id="1"]').exists()).toBeTruthy();
		expect(wrapper.find('photo-stub[id="2"]').exists()).toBeFalsy();
		expect(wrapper.find('photo-stub[id="3"]').exists()).toBeFalsy();
		expect(wrapper.vm.$data.currentMedia).toBe(0);

	});
});
