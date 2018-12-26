import sinon from 'sinon';
import { assert } from 'chai';
import profileStore from '@/store/profile';
import http from '@/Services/http.service';

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
				path: 'path'
			}
		});

		await profileStore.actions.load({
			commit,
			state: profileStore.state,
		}, 'test');

		assert.isTrue(getStub.calledOnce);
		assert.isTrue(getStub.calledWith('bio/test'));

		assert.isTrue(commit.calledTwice);
		assert.deepEqual(commit.firstCall.args, [
			'updateBio',
			{}
		]);

		assert.deepEqual(commit.secondCall.args, [
			'updateBio',
			{
				username: 'test',
				description: 'desc',
				path: 'path'
			}
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