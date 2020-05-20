import { assert } from 'chai';
import { shallowMount, mount } from '@vue/test-utils';
import ViewMarker from '@/Components/Modals/ViewMarker';
import sinon from 'sinon';

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


	beforeEach(() => {
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
			$bus: {
				$on: sinon.stub(),
				$off: sinon.stub(),
			},
			$router: {
				pushRoute: sinon.stub(),
				push: sinon.stub(),
				currentRoute: {
					params: {},
					path: '/'
				}
			},
			$route: {
				params: {}
			},
			$store: {
				state: {
					User: {
						user: null
					}
				}
			},
			$toast: {
				error: sinon.spy()
			}
		};
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Registers listeners', () => {
		shallowMount(ViewMarker, {
			stubs,
			mocks
		});

		assert.isTrue(mocks.$bus.$on.calledWith('marker-click'));
	});

	it('Unregisters listeners', () => {
		const wrapper = shallowMount(ViewMarker, {
			stubs,
			mocks
		});

		wrapper.destroy();

		assert.isTrue(mocks.$bus.$off.calledWith('marker-click'));
	});

	it('Renders with photo content', () => {
		const wrapper = mount(ViewMarker, {
			stubs,
			mocks
		});

		wrapper.setData({
			modal: true,
			marker
		});

		assert.isTrue(wrapper.find('.modal').exists());
		assert.isTrue(wrapper.find('viewmarkerheader-stub').exists());
		assert.isTrue(wrapper.find('viewmarkercontent-stub').exists());
		assert.isTrue(wrapper.find('photo-stub').exists());
	});

	it('Renders pagination when there are multiple media and selected media', () => {
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
			stubs,
			mocks
		});

		wrapper.setData({
			modal: true,
			currentMedia: 1,
			marker
		});

		assert.isTrue(wrapper.find('.modal').exists());
		assert.isTrue(wrapper.find('viewmarkerheader-stub').exists());
		assert.isTrue(wrapper.find('viewmarkercontent-stub').exists());
		assert.isFalse(wrapper.find('photo-stub[id="1"]').exists());
		assert.isTrue(wrapper.find('photo-stub[id="2"]').exists());
		assert.isTrue(wrapper.find('.click-pagination').exists());
	});


	it('Renders with instagram content', () => {
		marker.media[0].type = 'instagram';
		const wrapper = mount(ViewMarker, {
			stubs,
			mocks
		});
		wrapper.setData({
			modal: true,
			marker
		});
		assert.isTrue(wrapper.find('.modal').exists());
		assert.isTrue(wrapper.find('viewmarkerheader-stub').exists());
		assert.isTrue(wrapper.find('viewmarkercontent-stub').exists());
		assert.isTrue(wrapper.find('instagram-stub').exists());
	});

	it('doesnt render when modal not active', () => {
		const wrapper = mount(ViewMarker, {
			stubs,
			mocks
		});
		wrapper.setData({
			modal: false,
			marker
		});
		assert.isTrue(wrapper.find('.modal').exists());
		assert.isFalse(wrapper.find('viewmarkerheader-stub').exists());
		assert.isFalse(wrapper.find('viewmarkercontent-stub').exists());
	});

	it('Shows delete button for markers user', () => {
		mocks.$store.state.User.user = {
			id: 1
		};
		const wrapper = mount(ViewMarker, {
			mocks,
			stubs
		});

		wrapper.setData({
			modal: true,
			marker
		});

		assert.isTrue(wrapper.find('button.is-danger-background').exists());
	});

	it('Doesnt show delete button for different user', () => {

		const wrapper = shallowMount(ViewMarker, {
			mocks
		});

		wrapper.setData({
			modal: true,
			marker
		});

		assert.isFalse(wrapper.find('button.is-danger').exists());
	});

	it('Closes modal with close button', async () => {
		const wrapper = mount(ViewMarker, {
			mocks,
			stubs
		});

		wrapper.setData({
			modal: true,
			marker
		});

		wrapper.find('.card__footer-item a').trigger('click');

		assert.isFalse(wrapper.vm.$data.modal);
	});

	it('Calculates route name', () => {
		const wrapper = shallowMount(ViewMarker, {
			mocks
		});

		wrapper.setData({
			modal: true,
			marker
		});

		assert.equal(wrapper.vm.routeName, 'test/1');
	});

	it('Shows marker', async () => {
		const wrapper = shallowMount(ViewMarker, {
			mocks
		});

		wrapper.setData({
			modal: false,
		});

		await wrapper.vm.showMarker(marker);

		assert.isTrue(wrapper.vm.$data.modal);
		assert.deepEqual(wrapper.vm.$data.marker, marker);
	});

	it('Shows marker with pagination hint when album', (done) => {
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
			mocks
		});

		wrapper.setData({
			modal: false,
		});

		wrapper.vm.showMarker(marker);

		assert.isTrue(wrapper.vm.$data.modal);
		assert.deepEqual(wrapper.vm.$data.marker, marker);
		assert.isTrue(wrapper.vm.$data.showAlbumHint);

		setTimeout(() => {
			assert.isFalse(wrapper.vm.$data.showAlbumHint);
			done();
		}, 1510);
	});

	it('Deletes marker', async () => {
		const dispatchStub = sinon.stub().returns(true);
		mocks.$store = {
			dispatch: dispatchStub
		};
		const wrapper = shallowMount(ViewMarker, {
			mocks
		});

		wrapper.setData({
			modal: true,
			marker
		});

		await wrapper.vm.deleteMarker();
		assert.isFalse(wrapper.vm.$data.modal);
	});

	it('Shows toast when deleteing a marker fails', async () => {

		const dispatchStub = sinon.stub().returns(false);
		mocks.$store = {
			dispatch: dispatchStub
		};
		const wrapper = shallowMount(ViewMarker, {
			mocks
		});

		wrapper.setData({
			modal: true,
			marker
		});

		await wrapper.vm.deleteMarker();

		assert.isTrue(dispatchStub.calledOnce);
		assert.isTrue(dispatchStub.calledWith('Markers/delete', {id: 1, story: null}));
		assert.isTrue(mocks.$toast.error.calledOnce);
		assert.isTrue(mocks.$toast.error.calledWith('Please try again at a later time', 'Delete failed.'));
	});

	it('Calls with delete with story when in story page', async () => {
		mocks.$route.params.story = 1;
		const dispatchStub = sinon.stub().returns(true);
		mocks.$store = {
			dispatch: dispatchStub
		};
		const wrapper = shallowMount(ViewMarker, {
			mocks
		});

		wrapper.setData({
			modal: true,
			marker
		});

		await wrapper.vm.deleteMarker();

		assert.isTrue(dispatchStub.calledOnce);
		assert.isTrue(dispatchStub.calledWith('Markers/delete', {id: 1, story: 1}));
		assert.isFalse(wrapper.vm.$data.modal);
	});

	it('Closes modal and enables user navigation flag', async () => {
		const wrapper = mount(ViewMarker, {
			mocks,
			stubs
		});

		wrapper.setData({
			modal: true,
			marker
		});

		wrapper.find('viewmarkerheader-stub').vm.$emit('view-user-page');

		assert.isFalse(wrapper.vm.$data.modal);
		assert.isTrue(wrapper.vm.$data.userNavigation);
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
			stubs,
			mocks
		});

		wrapper.setData({
			modal: true,
			marker
		});
		assert.isTrue(wrapper.find('photo-stub[id="1"]').exists());
		assert.isFalse(wrapper.find('photo-stub[id="2"]').exists());
		assert.equal(wrapper.vm.$data.currentMedia, 0);

		wrapper.vm.changeMedia(1);

		assert.isFalse(wrapper.find('photo-stub[id="1"]').exists());
		assert.isTrue(wrapper.find('photo-stub[id="2"]').exists());
		assert.equal(wrapper.vm.$data.currentMedia, 1);

		wrapper.vm.changeMedia(-1);

		assert.isTrue(wrapper.find('photo-stub[id="1"]').exists());
		assert.isFalse(wrapper.find('photo-stub[id="2"]').exists());
		assert.equal(wrapper.vm.$data.currentMedia, 0);

		wrapper.vm.changeMedia(-1);

		assert.isFalse(wrapper.find('photo-stub[id="1"]').exists());
		assert.isTrue(wrapper.find('photo-stub[id="2"]').exists());
		assert.equal(wrapper.vm.$data.currentMedia, 1);

		wrapper.vm.changeMedia(1);

		assert.isTrue(wrapper.find('photo-stub[id="1"]').exists());
		assert.isFalse(wrapper.find('photo-stub[id="2"]').exists());
		assert.equal(wrapper.vm.$data.currentMedia, 0);
	});

	it('Navigates to user when flag is true and modal is closed', async () => {
		const wrapper = mount(ViewMarker, {
			stubs,
			mocks
		});

		wrapper.setData({
			modal: true,
			marker,
			userNavigation: true
		});

		wrapper.vm.closedNavigation();

		assert.isTrue(mocks.$router.push.calledOnce);
		assert.isTrue(mocks.$router.push.calledWith('/test'));
		assert.isFalse(wrapper.vm.$data.userNavigation);
	});

	it('Navigates back to user when it was loaded before', async () => {
		mocks.$router.currentRoute.params.username = 'test';
		const wrapper = mount(ViewMarker, {
			stubs,
			mocks
		});

		wrapper.setData({
			modal: true,
			marker,
		});

		wrapper.vm.closedNavigation();

		assert.isTrue(mocks.$router.pushRoute.calledTwice);
		assert.isTrue(mocks.$router.pushRoute.secondCall.calledWith('test'));
	});

	it('Navigates back to previous url if there was no user before', async () => {
		mocks.$router.currentRoute.path = 'edit';
		const wrapper = mount(ViewMarker, {
			stubs,
			mocks
		});

		wrapper.setData({
			modal: true,
			marker,
		});

		wrapper.vm.closedNavigation();

		assert.isTrue(mocks.$router.pushRoute.calledTwice);
		assert.isTrue(mocks.$router.pushRoute.secondCall.calledWith('edit'));
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
			stubs,
			mocks
		});

		wrapper.setData({
			modal: true,
			marker
		});

		const indicators = wrapper.findAll('.pagination-indicators__indicator');

		assert.isTrue(wrapper.find('.pagination-indicators').exists());
		assert.equal(3, indicators.length);

		assert.isTrue(wrapper.find('photo-stub[id="1"]').exists());
		assert.isFalse(wrapper.find('photo-stub[id="2"]').exists());
		assert.isFalse(wrapper.find('photo-stub[id="3"]').exists());
		assert.equal(wrapper.vm.$data.currentMedia, 0);

		indicators.at(1).trigger('click');
		assert.isFalse(wrapper.find('photo-stub[id="1"]').exists());
		assert.isTrue(wrapper.find('photo-stub[id="2"]').exists());
		assert.isFalse(wrapper.find('photo-stub[id="3"]').exists());
		assert.equal(wrapper.vm.$data.currentMedia, 1);

		indicators.at(2).trigger('click');
		assert.isFalse(wrapper.find('photo-stub[id="1"]').exists());
		assert.isFalse(wrapper.find('photo-stub[id="2"]').exists());
		assert.isTrue(wrapper.find('photo-stub[id="3"]').exists());
		assert.equal(wrapper.vm.$data.currentMedia, 2);

		indicators.at(0).trigger('click');
		assert.isTrue(wrapper.find('photo-stub[id="1"]').exists());
		assert.isFalse(wrapper.find('photo-stub[id="2"]').exists());
		assert.isFalse(wrapper.find('photo-stub[id="3"]').exists());
		assert.equal(wrapper.vm.$data.currentMedia, 0);

	});
});
