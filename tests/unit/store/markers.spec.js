import sinon from 'sinon';
import { assert } from 'chai';
import markersStore from '@/store/markers';
import http from '@/services/http.service';

describe('Marker Store', () => {

	afterEach('Reset sinon and settings', () => {
		sinon.restore();
	});

	it('Adds a marker', () => {
		const state = {
			markers: []
		};

		markersStore.mutations.add(state, {
			id: 1,
			name: 'test'
		});

		assert.equal(state.markers.length, 1);
		assert.deepEqual(state.markers[0], {
			id: 1,
			name: 'test'
		});
	});

	it('Removes a marker', () => {
		const state = {
			markers: [{
				id: 1,
				name: 'test'
			}]
		};

		markersStore.mutations.remove(state, 1);

		assert.equal(state.markers.length, 0);
		assert.deepEqual(state.markers, []);
	});


	it('Clears markers', () => {
		const state = {
			markers: [{
				id: 1,
				name: 'test'
			}]
		};

		markersStore.mutations.clear(state);

		assert.equal(state.markers.length, 0);
		assert.deepEqual(state.markers, []);
	});

	it('Removes markers on successful delete', async () => {
		const deleteStub = sinon.stub(http, 'delete').callsFake(() => {
			return true;
		});
		const commitSpy = sinon.spy();

		await markersStore.actions.delete({
			commit: commitSpy
		}, 1);

		assert.isTrue(deleteStub.calledOnce);
		assert.isTrue(deleteStub.calledWith('marker/1'));
		assert.isTrue(commitSpy.calledOnce);
		assert.isTrue(commitSpy.calledWith('remove', 1));
	});

	it('Keeps markers on failed delete', async () => {
		sinon.stub(http, 'delete').callsFake(() => {
			return false;
		});
		const commitSpy = sinon.spy();

		await markersStore.actions.delete({
			commit: commitSpy
		}, 1);

		assert.isFalse(commitSpy.calledOnce);
		assert.isFalse(commitSpy.calledWith('remove', 1));
	});

	it('Loads markers', async () => {
		const getStub = sinon.stub(http, 'get').callsFake(() => {
			return {
				status: 200,
				data: [{
					id: 1
				}, {
					id: 2
				}]
			};
		});
		const commitSpy = sinon.spy();

		const response = await markersStore.actions.load({
			commit: commitSpy
		});

		assert.isTrue(getStub.calledOnce);
		assert.isTrue(getStub.calledWith('marker/'));
		assert.isTrue(commitSpy.calledThrice);
		assert.isTrue(commitSpy.calledWith('clear'));
		assert.isTrue(commitSpy.calledWith('add', {
			id: 1
		}));
		assert.isTrue(commitSpy.calledWith('add', {
			id: 2
		}));
		assert.deepEqual(response, {
			status: 200,
			data: [{
				id: 1
			}, {
				id: 2
			}]
		});
	});

	it('Loads users markers', async () => {
		const getStub = sinon.stub(http, 'get').callsFake(() => {
			return {
				status: 200,
				data: [{
					id: 1
				}]
			};
		});
		const commitSpy = sinon.spy();

		const response = await markersStore.actions.load({
			commit: commitSpy
		}, 'test');

		assert.isTrue(getStub.calledOnce);
		assert.isTrue(getStub.calledWith('marker/test'));
		assert.isTrue(commitSpy.calledTwice);
		assert.isTrue(commitSpy.calledWith('clear'));
		assert.isTrue(commitSpy.calledWith('add', {
			id: 1
		}));
		assert.deepEqual(response, {
			status: 200,
			data: [{
				id: 1
			}]
		});
	});


	it('Loads cached markers', async () => {
		const getStub = sinon.stub(http, 'get').callsFake(() => {
			return {
				status: 'cached',
				data: [{
					id: 1
				}]
			};
		});
		const commitSpy = sinon.spy();

		const response = await markersStore.actions.load({
			commit: commitSpy
		});

		assert.isTrue(getStub.calledOnce);
		assert.isTrue(getStub.calledWith('marker/'));
		assert.isTrue(commitSpy.calledTwice);
		assert.isTrue(commitSpy.calledWith('clear'));
		assert.isTrue(commitSpy.calledWith('add', {
			id: 1
		}));
		assert.deepEqual(response, {
			status: 'cached',
			data: [{
				id: 1
			}]
		});
	});

	it('Returns error response when request fails', async () => {
		const getStub = sinon.stub(http, 'get').callsFake(() => {
			return {
				status: 403,
			};
		});
		const commitSpy = sinon.spy();

		const response = await markersStore.actions.load({
			commit: commitSpy
		});

		assert.isTrue(getStub.calledOnce);
		assert.isTrue(getStub.calledWith('marker/'));
		assert.isTrue(commitSpy.calledOnce);
		assert.isTrue(commitSpy.calledWith('clear'));

		assert.deepEqual(response, {
			status: 403,
		});
	});

	it('Toggles userMarker on', () => {
		const state = {
			userMarker: false
		};

		markersStore.mutations.toggleUserMarker(state);

		assert.isTrue(state.userMarker);
	});

	it('Toggles userMarker off', () => {
		const state = {
			userMarker: true
		};

		markersStore.mutations.toggleUserMarker(state);

		assert.isFalse(state.userMarker);
	});

});