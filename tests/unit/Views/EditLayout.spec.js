import { shallowMount } from '@vue/test-utils';
import EditLayout from '@/Views/EditLayout.vue';
import { assert } from 'chai';
import sinon from "sinon";
import map from "@/Services/LeafletMapService";
import auth from '@/Services/authentication.service';

describe('EditLayout.vue', () => {
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
			$modal: {
				hide: sinon.spy(),
				show: sinon.spy()
			}
		};

		sinon.stub(auth, 'getUserDetails').returns({
			username: 'test'
		});
	});


	afterEach(() => {
		sinon.restore();
	});

	it('renders', () => {
		const loadMarkersSpy = sinon.spy();
		const wrapper = shallowMount(EditLayout, {
			methods: {
				loadMarkers: loadMarkersSpy
			},
		});

		assert.isTrue(wrapper.find('.layout').exists());
		assert.isTrue(wrapper.find('dashboard-stub').exists());
		assert.isTrue(loadMarkersSpy.calledOnce);
	});

	it('Loads Markers', async () => {
		{
			const goToCurrentLocationStub = sinon.stub(map, 'goToCurrentLocation');
			await shallowMount(EditLayout, {
				mocks
			});

			assert.isTrue(mocks.$modal.hide.calledOnce);
			assert.isTrue(mocks.$modal.hide.calledWith('404'));

			assert.isTrue(mocks.$store.commit.calledTwice);
			assert.isTrue(mocks.$store.commit.calledWith('Markers/setBorders', false));
			assert.isTrue(mocks.$store.commit.calledWith('Markers/setUser', 'test'));

			assert.isTrue(mocks.$store.dispatch.calledOnce);
			assert.isTrue(mocks.$store.dispatch.calledWith('Markers/load'));

			assert.isTrue(goToCurrentLocationStub.calledOnce);
			assert.isTrue(goToCurrentLocationStub.calledWith());
		}
	});

	it('Shows cache toast when loaded from cache', async () => {
		sinon.stub(map, 'goToCurrentLocation');
		mocks.$store.dispatch.returns({
			status: 'cached'
		});
		mocks.$toast = {
			info: sinon.spy()
		};
		await shallowMount(EditLayout, {
			mocks
		});

		assert.isTrue(mocks.$toast.info.calledOnce);
		assert.isTrue(mocks.$toast.info.calledWith('Markers loaded from cache', ''));
	});
});
