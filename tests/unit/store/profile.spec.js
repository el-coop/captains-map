import sinon from 'sinon';
import { assert } from 'chai';
import store from '@/store';
import profileStore from '@/store/profile';
import http from '@/Services/HttpService';

describe('User Store', () => {

	afterEach('Reset sinon and settings', () => {
		sinon.restore();
	});

	it('Toggles profile open', () => {

		profileStore.mutations.toggle(profileStore.state);

		assert.isTrue(profileStore.state.open);
	});

	it('Toggles profile closed', () => {
		profileStore.state.open = true;
		profileStore.mutations.toggle(profileStore.state);

		assert.isFalse(profileStore.state.open);
	});

	it('Updates user profile', () => {

		profileStore.mutations.updateBio(profileStore.state, {
			description: 'desc',
			path: 'path'
		});

		assert.deepEqual(profileStore.state.user, {
			description: 'desc',
			path: 'path'
		});
	});

	it('adds a story to list', () => {

		profileStore.mutations.addStory(profileStore.state, {
			id: 1
		});

		assert.deepEqual(profileStore.state.stories, [{
			id: 1
		}]);
	});

	it('removes a story from list', () => {
		profileStore.state.stories = [{
			id: 1
		}];

		profileStore.mutations.removeStory(profileStore.state, {
			id: 1
		});

		assert.deepEqual(profileStore.state.stories, []);
	});

	it('sets stories', () => {
		profileStore.state.stories = [{
			id: 1
		}];

		profileStore.mutations.setStories(profileStore.state, [{id: 2}, {id: 3}]);

		assert.deepEqual(profileStore.state.stories, [{id: 2}, {id: 3}]);
	});

	it('Tracks stories cover photos', async () => {
		profileStore.state.stories = [{
			id: 1,
			cover: {
				'type': 'type1',
				'path': 'path1'
			}
		}];

		profileStore.mutations.trackStory(profileStore.state, {
			id: 1,
			cover: {
				'type': 'type2',
				'path': 'path2'
			}
		})

		assert.deepEqual(profileStore.state.stories[0].cover, {
			'type': 'type2',
			'path': 'path2'
		});
	});

	it('Updates story', async () => {
		profileStore.state.stories = [{
			id: 1,
			name: 'bla',
			published: 0
		}];

		profileStore.mutations.updateStory(profileStore.state, {
			id: 1,
			name: 'story',
			published: 1
		})

		assert.deepEqual(profileStore.state.stories[0], {
			id: 1,
			name: 'story',
			published: 1
		});
	});


	it('Loads user bio', async () => {

		const commit = sinon.stub();
		const getStub = sinon.stub(http, 'get').returns({
			data: {
				description: 'desc',
				path: 'path',
				stories: [{
					id: 1
				}, {
					id: 2
				}]
			}
		});

		await profileStore.actions.load({
			commit,
			state: profileStore.state,
		}, 'test');

		assert.isTrue(getStub.calledOnce);
		assert.isTrue(getStub.calledWith('bio/test'));

		assert.equal(commit.callCount, 4);

		assert.deepEqual(commit.firstCall.args, [
			'updateBio',
			{}
		]);

		assert.deepEqual(commit.secondCall.args, [
			'setStories',
			[]
		]);

		assert.deepEqual(commit.thirdCall.args, [
			'updateBio',
			{
				username: 'test',
				description: 'desc',
				path: 'path'
			}
		]);

		assert.deepEqual(commit.getCall(3).args, [
			'setStories',
			[{
				id: 1
			}, {
				id: 2
			}]
		]);
	});

	it('Doesnt load new bio when user is the same', async () => {

		profileStore.state.user.username = 'test';

		const commit = sinon.stub();
		const getStub = sinon.stub(http, 'get');

		await profileStore.actions.load({
			commit,
			state: profileStore.state,
		}, 'test');

		assert.isFalse(getStub.called);
		assert.isFalse(commit.called);

	});

	it('Purges bio and storues', async () => {

		const commit = sinon.stub();

		await profileStore.actions.purge({
			commit,
		});

		assert.isTrue(commit.calledTwice);
		assert.isTrue(commit.firstCall.calledWith('updateBio', {}));
		assert.isTrue(commit.secondCall.calledWith('setStories', []));

	});
});
