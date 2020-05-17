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

	it('Loads user bio', async () => {

		const commit = sinon.stub();
		const getStub = sinon.stub(http, 'get').returns({
			data: {
				description: 'desc',
				path: 'path',
				stories: []
			}
		});

		await profileStore.actions.load({
			commit,
			state: profileStore.state,
		}, 'test');

		assert.isTrue(getStub.calledOnce);
		assert.isTrue(getStub.calledWith('bio/test'));

		assert.equal(commit.callCount,4);

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
			[]
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
});
