import sinon from 'sinon';
import {describe, it, expect, afterEach} from 'vitest';
import { getters } from '@/store';

import storiesStore from '@/store/stories';
import http from '@/Services/HttpService';

describe('Stories Store', () => {

	afterEach(() => {
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

		expect(storiesStore.state, {
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

		expect(storiesStore.state.markers).toEqual([{
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

		expect(storiesStore.state.markers).toEqual([{
			id: 2,
			media: [{
				type: 'type',
				path: 'path'
			}]
		}]);

		expect(storiesStore.state.story.cover).toEqual({
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

		expect(storiesStore.state.markers).toEqual([]);

		expect(storiesStore.state.story.cover).toEqual({
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

		expect(getStub.called).toBeTruthy();
		expect(getStub.calledWith('story/test/1')).toBeTruthy();
		expect(response).toBe(200);
		expect(storiesStore.state.loading).toBeFalsy();
		expect(storiesStore.state.story).toEqual({
			id: 1,
			name: 'name',
			user_id: 1,
			published: 1,
			cover: {
				type: 'type',
				path: 'path',
			}
		});
		expect(storiesStore.state.markers).toEqual(data.markers);
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

		expect(getStub.called).toBeTruthy();
		expect(getStub.calledWith('story/test/1')).toBeTruthy();
		expect(response, 404);
		expect(storiesStore.state.loading).toBeFalsy();
		expect(storiesStore.state.story).toBe(null);
		expect(storiesStore.state.markers).toEqual([]);
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

		expect(postStub.calledOnce).toBeTruthy();
		expect(postStub.calledWith('story', {
			name: 'name',
			published: 0
		})).toBeTruthy();

		expect(commit.calledOnce).toBeTruthy();
		expect(commit.calledWith('Profile/addStory', {id: 1}, {root: true})).toBeTruthy();

		expect(response).toEqual( {
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

		expect(patchStub.calledOnce).toBeTruthy();
		expect(patchStub.calledWith('story/1',{
			name: 'name',
			published: 1
		})).toBeTruthy();

		expect(commit.called).toBeTruthy();
		expect(commit.calledWith('Profile/updateStory', {
			id: 1,
			name: 'name',
			published: 1
		})).toBeTruthy();

		expect(response).toEqual({
			status: 200,
			id: 1
		});
		expect(storiesStore.state.story).toEqual({
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

		expect(patchStub.calledOnce).toBeTruthy();
		expect(patchStub.calledWith('story/1', {
			name: 'name',
			published: 1
		})).toBeTruthy();

		expect(commit.notCalled).toBeTruthy();

		expect(response).toEqual({
			status: 500,
			id: 0
		});
		expect(storiesStore.state.story).toEqual({
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

		expect(deleteStub.calledOnce).toBeTruthy();
		expect(deleteStub.calledWith('story/1')).toBeTruthy();

		expect(commit.calledOnce).toBeTruthy();
		expect(commit.calledWith('Profile/removeStory', 1, {root: true})).toBeTruthy();

		expect(response).toBeTruthy();
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

		expect(deleteStub.calledOnce).toBeTruthy();
		expect(deleteStub.calledWith('story/1')).toBeTruthy();

		expect(commit.notCalled).toBeTruthy();

		expect(response).toBeFalsy();
	});
});
