import { shallowMount } from '@vue/test-utils';
import EditPage from '@/Views/EditPage.vue';
import { assert } from 'chai';
import sinon from "sinon";
import map from "@/Services/LeafletMapService";

describe('EditPage.vue', () => {
	let mocks;
	let goToCurrentLocationStub;

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
					},
					User: {
						user: {
							username: 'test'
						}
					}
				}
			},
			$bus: {
				$emit: sinon.spy(),
			}
		};
		goToCurrentLocationStub = sinon.stub(map, 'goToCurrentLocation');
	});


	afterEach(() => {
		sinon.restore();
	});

	it('renders', () => {
		const loadMarkersSpy = sinon.spy();
		const wrapper = shallowMount(EditPage, {
			methods: {
				loadMarkers: loadMarkersSpy
			},
			mocks
		});

		assert.isTrue(wrapper.find('.layout').exists());
		assert.isTrue(wrapper.find('TheDashboard-stub').exists());
		assert.isTrue(wrapper.find('CreateMarker-stub').exists());
		assert.isTrue(loadMarkersSpy.calledOnce);
	});

	it('Loads Markers', async () => {
		await shallowMount(EditPage, {
			mocks
		});

		assert.isTrue(mocks.$bus.$emit.calledWith('env-setup'));

		assert.isTrue(mocks.$store.commit.calledThrice);
		assert.isTrue(mocks.$store.commit.calledWith('Markers/setBorders', false));
		assert.isTrue(mocks.$store.commit.calledWith('Markers/setUser', 'test'));
		assert.isTrue(mocks.$store.commit.calledWith('Stories/exit'));

		assert.isTrue(mocks.$store.dispatch.calledTwice);
		assert.isTrue(mocks.$store.dispatch.calledWith('Markers/load'));
		assert.isTrue(mocks.$store.dispatch.calledWith('Profile/load'));

		assert.isTrue(goToCurrentLocationStub.calledOnce);
		assert.isTrue(goToCurrentLocationStub.calledWith());
	});

	it('Shows cache toast when loaded from cache', async () => {
		mocks.$store.dispatch.returns({
			status: 'cached'
		});
		mocks.$toast = {
			info: sinon.spy()
		};
		await shallowMount(EditPage, {
			mocks
		});

		assert.isTrue(mocks.$toast.info.calledOnce);
		assert.isTrue(mocks.$toast.info.calledWith('Markers loaded from cache', ''));
	});

});
