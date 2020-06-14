import sinon from 'sinon';
import { assert } from 'chai';
import store from '@/store';
import storiesStore from '@/store/stories';
import http from '@/Services/HttpService';

describe('Stories Store', () => {

	afterEach('Reset sinon and settings', () => {
		sinon.restore();
	});

	it('Exit stories', () => {
		storiesStore.state = {
			story: {
				id: 1
			},
			markers: [{
				id: 1
			}]
		}

		storiesStore.mutations.exit(storiesStore.state);

		assert.deepEqual(storiesStore.state, {
			story: null,
			markers: []
		});
	});

	it('Add marker to story', () => {
		storiesStore.state = {
			story: {
				id: 1
			},
			markers: [{
				id: 1
			}]
		}
		storiesStore.mutations.add(storiesStore.state, {
			id: 2
		});

		assert.deepEqual(storiesStore.state.markers, [{
			id: 1
		}, {
			id: 2
		}]);
	});

	it('Removes marker from story and changes cover photo when one left', () => {
		storiesStore.state = {
			story: {
				id: 1
			},
			markers: [{
				id: 1
			}, {
				id: 2,
				media: [{
					type: 'type',
					path: 'path'
				}]
			}]
		}
		storiesStore.mutations.remove(storiesStore.state, 1);

		assert.deepEqual(storiesStore.state.markers, [{
			id: 2,
			media: [{
				type: 'type',
				path: 'path'
			}]
		}]);

		assert.deepEqual(storiesStore.state.story.cover, {
			type: 'type',
			path: 'path'
		});
	});

	it('Removes marker from story and removes cover photo when none left', () => {
		storiesStore.state = {
			story: {
				id: 1
			},
			markers: [{
				id: 1
			}]
		}
		storiesStore.mutations.remove(storiesStore.state, 1);

		assert.deepEqual(storiesStore.state.markers, []);

		assert.deepEqual(storiesStore.state.story.cover, {
			type: null,
			path: null
		});
	});

	it('Loads story', async () => {
		storiesStore.state = {
			story: null,
			markers: [],
			loading: false,
		};
		const data = {
			id: 1,
			name: 'name',
			user_id: 1,
			published: 1,
			cover: {
				type: 'type',
				path: 'path',
			},
			markers: [{
				id: 1
			}, {
				id: 2
			}],
		};

		const getStub = sinon.stub(http, 'get').callsFake(() => {
			return {
				status: 200,
				data
			};
		});

		const response = await storiesStore.actions.load(storiesStore, {
			user: 'test',
			storyId: 1
		});

		assert.isTrue(getStub.called);
		assert.isTrue(getStub.calledWith('story/test/1'));
		assert.equal(response, 200);
		assert.isFalse(storiesStore.state.loading);
		assert.deepEqual(storiesStore.state.story, {
			id: 1,
			name: 'name',
			user_id: 1,
			published: 1,
			cover: {
				type: 'type',
				path: 'path',
			}
		});
		assert.deepEqual(storiesStore.state.markers, data.markers);
	});

	it('Returns 404 when api returns 404', async () => {
		storiesStore.state = {
			story: null,
			markers: [],
			loading: false,
		};

		const getStub = sinon.stub(http, 'get').callsFake(() => {
			return {
				status: 404,
			};
		});

		const response = await storiesStore.actions.load(storiesStore, {
			user: 'test',
			storyId: 1
		});

		assert.isTrue(getStub.called);
		assert.isTrue(getStub.calledWith('story/test/1'));
		assert.equal(response, 404);
		assert.isFalse(storiesStore.state.loading);
		assert.equal(storiesStore.state.story, null);
		assert.deepEqual(storiesStore.state.markers, []);
	});

	it('Saves new story', async () => {

		const commit = sinon.stub();

		const data = {
			id: 1
		}

		const postStub = sinon.stub(http, 'post').callsFake(() => {
			return {
				status: 201,
				data
			};
		});

		const response = await storiesStore.actions.save({state: storiesStore.state, commit}, {
			name: 'name'
		});

		assert.isTrue(postStub.calledOnce);
		assert.isTrue(postStub.calledWith('story', {
			name: 'name',
			published: 0
		}));

		assert.isTrue(commit.calledOnce);
		assert.isTrue(commit.calledWith('Profile/addStory', {id: 1}, {root: true}));

		assert.deepEqual(response, {
			status: 201,
			id: 1
		});
	});

	it('Patches existing story', async () => {

		const commit = sinon.stub();

		storiesStore.state = {
			story: {
				id: 1
			}
		}
		const data = {
			id: 1
		}

		const patchStub = sinon.stub(http, 'patch').callsFake(() => {
			return {
				status: 200,
				data
			};
		});

		const response = await storiesStore.actions.save({state: storiesStore.state, commit}, {
			name: 'name',
			published: 1
		});

		assert.isTrue(patchStub.calledOnce);
		assert.isTrue(patchStub.calledWith('story/1', {
			name: 'name',
			published: 1
		}));

		assert.isTrue(commit.called);
		assert.isTrue(commit.calledWith('Profile/updateStory', {
			id: 1,
			name: 'name',
			published: 1
		}));

		assert.deepEqual(response, {
			status: 200,
			id: 1
		});
		assert.deepEqual(storiesStore.state.story, {
			id: 1,
			name: 'name',
			published: 1
		});
	});

	it('Returns fail status when save fails', async () => {

		const commit = sinon.stub();

		storiesStore.state = {
			story: {
				id: 1
			}
		}

		const data = {};

		const patchStub = sinon.stub(http, 'patch').callsFake(() => {
			return {
				status: 500,
				data
			};
		});

		const response = await storiesStore.actions.save({state: storiesStore.state, commit}, {
			name: 'name',
			published: 1
		});

		assert.isTrue(patchStub.calledOnce);
		assert.isTrue(patchStub.calledWith('story/1', {
			name: 'name',
			published: 1
		}));

		assert.isTrue(commit.notCalled);

		assert.deepEqual(response, {
			status: 500,
			id: 0
		});
		assert.deepEqual(storiesStore.state.story, {
			id: 1,
		});
	});

	it('Deletes story', async () => {

		const commit = sinon.stub();

		storiesStore.state = {
			story: {
				id: 1
			}
		}

		const deleteStub = sinon.stub(http, 'delete').callsFake(() => {
			return {
				status: 200,
			};
		});

		const response = await storiesStore.actions.delete({state: storiesStore.state, commit});

		assert.isTrue(deleteStub.calledOnce);
		assert.isTrue(deleteStub.calledWith('story/1'));

		assert.isTrue(commit.calledOnce);
		assert.isTrue(commit.calledWith('Profile/removeStory', 1, {root: true}));

		assert.isTrue(response);
	});

	it('Returns false when fails to delete a story', async () => {

		const commit = sinon.stub();

		storiesStore.state = {
			story: {
				id: 1
			}
		}

		const deleteStub = sinon.stub(http, 'delete').callsFake(() => {
			return {
				status: 403,
			};
		});

		const response = await storiesStore.actions.delete({state: storiesStore.state, commit});

		assert.isTrue(deleteStub.calledOnce);
		assert.isTrue(deleteStub.calledWith('story/1'));

		assert.isTrue(commit.notCalled);

		assert.isFalse(response);
	});
});
