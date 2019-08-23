import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import ViewPage from '@/Views/ViewPage.vue';
import { assert } from 'chai';
import map from '@/Services/LeafletMapService';
import sinon from 'sinon';
import router from '@/router';

describe('ViewPage.vue', () => {
	let mocks;

	beforeEach(() => {
		mocks = {
			$store: {
				commit: sinon.spy(),
				dispatch: sinon.stub().returns({
					status: 200
				}),
				state: {
					Markers: {
						markers: [{
							lat: 1,
							lng: -1
						}]
					}
				}
			},
			$route: {
				params: {}
			},
			$bus: {
				$emit: sinon.stub()
			}
		};
	});


	afterEach(() => {
		sinon.restore();
	});

	it('Renders', () => {
		const loadMarkersSpy = sinon.spy();
		const wrapper = shallowMount(ViewPage, {
			methods: {
				loadMarkers: loadMarkersSpy
			},
			mocks
		});

		assert.isTrue(wrapper.find('.layout').exists());
		assert.isTrue(wrapper.find('TheDashboard-stub').exists());
		assert.isTrue(loadMarkersSpy.calledOnce);
	});

	it('Loads Markers', async () => {
		{
			const mapSetViewStub = sinon.stub(map, 'setView');
			await shallowMount(ViewPage, {
				mocks
			});

			assert.isTrue(mocks.$bus.$emit.calledWith('env-setup'));

			assert.isTrue(mocks.$store.commit.calledTwice);
			assert.isTrue(mocks.$store.commit.calledWith('Markers/setBorders', false));
			assert.isTrue(mocks.$store.commit.calledWith('Markers/setUser', ''));

			assert.isTrue(mocks.$store.dispatch.calledOnce);
			assert.isTrue(mocks.$store.dispatch.calledWith('Markers/load', {
				startingId: false,
				pageIncluding: true
			}));

			assert.isTrue(mapSetViewStub.calledOnce);
			assert.isTrue(mapSetViewStub.calledWith([1, -1]));
		}
	});

	it('Loads 404 when response returns 404', async () => {
		mocks.$store.dispatch.returns({
			status: 404
		});
		await shallowMount(ViewPage, {
			mocks
		});

		assert.isTrue(mocks.$bus.$emit.calledWith('404'));
	});

	it('Shows cache toast when loaded from cache', async () => {
		sinon.stub(map, 'setView');
		mocks.$store.dispatch.returns({
			status: 'cached'
		});
		mocks.$toast = {
			info: sinon.spy()
		};
		await shallowMount(ViewPage, {
			mocks
		});

		assert.isTrue(mocks.$toast.info.calledOnce);
		assert.isTrue(mocks.$toast.info.calledWith('Markers loaded from cache', ''));
	});

	it('Goes to user location when no markers loaded', async () => {
		const goToLocationStub = sinon.stub(map, 'goToCurrentLocation');
		mocks.$store.state.Markers.markers = [];
		await shallowMount(ViewPage, {
			mocks
		});

		assert.isTrue(goToLocationStub.calledOnce);
	});

	it('Goes to specific marker location when specific in route', async () => {
		const mapSetViewStub = sinon.stub(map, 'setView');
		mocks.$store.state.Markers.markers = [{
			id: 1,
			lat: 1,
			lng: 1
		}, {
			id: 2,
			lat: 10,
			lng: 10
		}];

		mocks.$route.params.marker = 2;
		await shallowMount(ViewPage, {
			mocks
		});

		assert.isTrue(mapSetViewStub.calledOnce);
		assert.isTrue(mapSetViewStub.calledWith([10, 10]));
	});

	it('Loads 404 when specified marker isnt found', async () => {
		const mapSetViewStub = sinon.stub(map, 'setView');
		mocks.$store.state.Markers.markers = [{
			id: 1,
			lat: 1,
			lng: 1
		}, {
			id: 2,
			lat: 10,
			lng: 10
		}];

		mocks.$route.params.marker = 3;
		await shallowMount(ViewPage, {
			mocks
		});

		assert.isTrue(mocks.$bus.$emit.calledWith('404'));
		assert.isFalse(mapSetViewStub.called);
	});

	it('Sets username when specified', async () => {
		mocks.$store.state.Markers.markers = [{
			id: 1,
			lat: 1,
			lng: 1
		}, {
			id: 2,
			lat: 10,
			lng: 10
		}];
		sinon.stub(map, 'setView');

		mocks.$route.params.username = 'test';
		await shallowMount(ViewPage, {
			mocks
		});

		assert.isTrue(mocks.$store.commit.calledTwice);
		assert.isTrue(mocks.$store.commit.calledWith('Markers/setBorders', false));
		assert.isTrue(mocks.$store.commit.calledWith('Markers/setUser', 'test'));

		assert.isTrue(mocks.$store.dispatch.calledTwice);
		assert.isTrue(mocks.$store.dispatch.calledWith('Markers/load', {
			startingId: false,
			pageIncluding: true
		}));

		assert.isTrue(mocks.$store.dispatch.calledWith('Profile/load'));

	});

	it('Reloads markers when route changes', async () => {
		const loadMarkersSpy = sinon.spy();
		delete mocks.$route;

		const localVue = createLocalVue();
		localVue.use(VueRouter);
		const wrapper = await shallowMount(ViewPage, {
			methods: {
				loadMarkers: loadMarkersSpy
			},
			localVue,
			router,
			mocks
		});

		router.push(router.history.current.path === '/test' ? '/test1' : 'test');

		await wrapper.vm.$nextTick();

		assert.isTrue(loadMarkersSpy.calledTwice);
	});
});
