import { shallowMount, createLocalVue } from '@vue/test-utils';
import StoryPage from '@/Views/StoryPage.vue';
import { assert } from 'chai';
import map from '@/Services/LeafletMapService';
import sinon from 'sinon';

describe('StoryPage.vue', () => {
	let mocks;

	beforeEach(() => {
		mocks = {
			$store: {
				dispatch: sinon.stub(),
				state: {
					User: {
						user: null
					},
					Stories: {
						story: {
							user_id: 1
						},
						markers: [{
							id: 1,
							lat: 1,
							lng: -1
						}]
					}
				}
			},
			$route: {
				params: {
					story: 1
				}
			},
			$bus: {
				$emit: sinon.stub()
			}
		};
	});


	afterEach(() => {
		sinon.restore();
	});

	it('Renders without create marker when no logged in user', () => {
		sinon.stub(map, 'setView');
		const wrapper = shallowMount(StoryPage, {
			mocks
		});

		assert.isTrue(wrapper.find('.layout').exists());
		assert.isTrue(wrapper.find('TheDashboard-stub').exists());
		assert.isFalse(wrapper.find('CreateMarker-stub').exists());
		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('Stories/load', {
			user: mocks.$route.params.username,
			storyId: mocks.$route.params.story,
		}));
	});


	it('Renders without create marker when user didnt create story', () => {
		sinon.stub(map, 'setView');
		mocks.$store.state.User.user = {
			id: 2
		};
		const wrapper = shallowMount(StoryPage, {
			mocks
		});

		assert.isTrue(wrapper.find('.layout').exists());
		assert.isTrue(wrapper.find('TheDashboard-stub').exists());
		assert.isFalse(wrapper.find('CreateMarker-stub').exists());
		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('Stories/load', {
			user: mocks.$route.params.username,
			storyId: mocks.$route.params.story,
		}));

	});

	it('Renders with create marker when user created story', () => {

		mocks.$store.state.User.user = {
			id: 1
		};

		const wrapper = shallowMount(StoryPage, {
			mocks
		});

		assert.isTrue(wrapper.find('.layout').exists());
		assert.isTrue(wrapper.find('TheDashboard-stub').exists());
		assert.isTrue(wrapper.find('CreateMarker-stub').exists());
		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('Stories/load', {
			user: mocks.$route.params.username,
			storyId: mocks.$route.params.story,
		}));

	});

	it('Loads Markers', async () => {
		const mapSetViewStub = sinon.stub(map, 'setView');
		await shallowMount(StoryPage, {
			mocks
		});

		assert.isTrue(mocks.$bus.$emit.calledWith('env-setup'));

		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('Stories/load', {
			user: mocks.$route.params.username,
			storyId: mocks.$route.params.story,
		}));

		assert.isTrue(mapSetViewStub.calledOnce);
		assert.isTrue(mapSetViewStub.calledWith([1, -1]));

	});

	it('Loads 404 when response returns 404', async () => {
		mocks.$store.dispatch.returns(404);

		await shallowMount(StoryPage, {
			mocks
		});

		assert.isTrue(mocks.$bus.$emit.calledTwice);
		assert.deepEqual(mocks.$bus.$emit.secondCall.args, ['404']);
	});

	it('Shows cache toast when loaded from cache', async () => {
		sinon.stub(map, 'setView');
		mocks.$store.dispatch.returns('cached');
		mocks.$toast = {
			info: sinon.spy()
		};
		await shallowMount(StoryPage, {
			mocks
		});

		assert.isTrue(mocks.$toast.info.calledOnce);
		assert.isTrue(mocks.$toast.info.calledWith('Markers loaded from cache', ''));
	});


	it('Loads 404 when specified marker isnt found', async () => {
		const mapSetViewStub = sinon.stub(map, 'setView');
		mocks.$store.state.Stories.markers = [{
			id: 1,
			lat: 1,
			lng: 1
		}, {
			id: 2,
			lat: 10,
			lng: 10
		}];

		mocks.$route.params.marker = 3;
		await shallowMount(StoryPage, {
			mocks
		});

		assert.isTrue(mocks.$bus.$emit.calledWith('404'));
		assert.isFalse(mapSetViewStub.called);
	});

	it('Sets view to specific marker when it is found', async () => {
		const mapSetViewStub = sinon.stub(map, 'setView');
		mocks.$store.state.Stories.markers = [{
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
			mocks
		});

		assert.isTrue(mapSetViewStub.called);
		assert.isTrue(mapSetViewStub.calledWith([
			10, 10
		]));
	});

});
