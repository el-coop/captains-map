import sinon from 'sinon';
import {describe, it, expect, afterEach} from 'vitest';
import store from '@/store';
import profileStore from '@/store/profile';
import http from '@/Services/HttpService';

describe('User Store', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('Toggles profile open', () => {

		profileStore.mutations.toggle(profileStore.state);

		expect(profileStore.state.open).toBeTruthy();
	});

	it('Toggles profile closed', () => {
		profileStore.state.open = true;
		profileStore.mutations.toggle(profileStore.state);

		expect(profileStore.state.open).toBeFalsy();
	});

	it('Updates user profile', () => {

		profileStore.mutations.updateBio(profileStore.state, {
			description: 'desc',
			path: 'path'
		});

		expect(profileStore.state.user).toEqual({
			description: 'desc',
			path: 'path'
		});
	});

	it('adds a story to list', () => {

		profileStore.mutations.addStory(profileStore.state, {
			id: 1
		});

		expect(profileStore.state.stories).toEqual([{
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

		expect(profileStore.state.stories).toEqual([]);
	});

	it('sets stories', () => {
		profileStore.state.stories = [{
			id: 1
		}];

		profileStore.mutations.setStories(profileStore.state, [{id: 2}, {id: 3}]);

		expect(profileStore.state.stories).toEqual([{id: 2}, {id: 3}]);
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

		expect(profileStore.state.stories[0].cover).toEqual({
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

		expect(profileStore.state.stories[0]).toEqual({
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

		expect(getStub.calledOnce).toBeTruthy();
		expect(getStub.calledWith('bio/test')).toBeTruthy();

		expect(commit.callCount).toBe(4);

		expect(commit.firstCall.args).toEqual([
			'updateBio',
			{}
		]);

		expect(commit.secondCall.args).toEqual([
			'setStories',
			[]
		]);

		expect(commit.thirdCall.args).toEqual([
			'updateBio',
			{
				username: 'test',
				description: 'desc',
				path: 'path'
			}
		]);

		expect(commit.getCall(3).args).toEqual([
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

		expect(getStub.called).toBeFalsy();
		expect(commit.called).toBeFalsy();

	});

	it('Purges bio and storues', async () => {

		const commit = sinon.stub();

		await profileStore.actions.purge({
			commit,
		});

		expect(commit.calledTwice).toBeTruthy();
		expect(commit.firstCall.calledWith('updateBio', {})).toBeTruthy();
		expect(commit.secondCall.calledWith('setStories', [])).toBeTruthy();

	});
});
