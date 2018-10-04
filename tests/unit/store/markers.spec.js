import sinon from 'sinon';
import { assert } from 'chai';
import markersStore from '@/store/markers';
import http from '@/services/http.service';

const pageSize = parseInt(process.env.VUE_APP_PAGE_SIZE);

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
		const data = {
			markers: [{
				id: 1
			}, {
				id: 2
			}],

			pagination: {
				hasNext: false
			}
		};
		const state = {
			hasNext: false,
			username: '',
		};
		const getStub = sinon.stub(http, 'get').callsFake(() => {
			return {
				status: 200,
				data
			};
		});
		const commitSpy = sinon.spy();

		const response = await markersStore.actions.load({
			commit: commitSpy,
			state
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
		assert.isFalse(state.hasNext);
		assert.deepEqual(response, {
			status: 200,
			data
		});
	});

	it('Loads markers starting with specific id', async () => {
		const data = {
			markers: [{
				id: 3
			}, {
				id: 4
			}],

			pagination: {
				hasNext: false
			}
		};
		const state = {
			hasNext: false,
			username: ''
		};
		const getStub = sinon.stub(http, 'get').callsFake(() => {
			return {
				status: 200,
				data
			};
		});
		const commitSpy = sinon.spy();

		const response = await markersStore.actions.load({
			commit: commitSpy,
			state
		}, 2);

		assert.isTrue(getStub.calledOnce);
		assert.isTrue(getStub.calledWith('marker/?startingId=2'));
		assert.isTrue(commitSpy.calledTwice);
		assert.isFalse(commitSpy.calledWith('clear'));
		assert.isTrue(commitSpy.calledWith('add', {
			id: 3
		}));
		assert.isTrue(commitSpy.calledWith('add', {
			id: 4
		}));
		assert.isFalse(state.hasNext);
		assert.deepEqual(response, {
			status: 200,
			data
		});
	});

	it('Loads users markers', async () => {
		const data = {
			markers: [{
				id: 1
			}],

			pagination: {
				hasNext: true
			}
		};
		const state = {
			hasNext: false,
			username: 'test'
		};
		const getStub = sinon.stub(http, 'get').callsFake(() => {
			return {
				status: 200,
				data
			};
		});
		const commitSpy = sinon.spy();

		const response = await markersStore.actions.load({
			commit: commitSpy,
			state
		});

		assert.isTrue(getStub.calledOnce);
		assert.isTrue(getStub.calledWith('marker/test'));
		assert.isTrue(commitSpy.calledTwice);
		assert.isTrue(commitSpy.calledWith('clear'));
		assert.isTrue(commitSpy.calledWith('add', {
			id: 1
		}));
		assert.isTrue(state.hasNext);
		assert.deepEqual(response, {
			status: 200,
			data
		});
	});


	it('Loads cached markers', async () => {
		const data = {
			markers: [{
				id: 1
			}],
			pagination: {
				hasNext: true
			}
		};
		const state = {
			hasNext: false,
			username: ''
		};
		const getStub = sinon.stub(http, 'get').callsFake(() => {
			return {
				status: 'cached',
				data
			};
		});
		const commitSpy = sinon.spy();

		const response = await markersStore.actions.load({
			commit: commitSpy,
			state
		});

		assert.isTrue(state.hasNext);
		assert.isTrue(getStub.calledOnce);
		assert.isTrue(getStub.calledWith('marker/'));
		assert.isTrue(commitSpy.calledTwice);
		assert.isTrue(commitSpy.calledWith('clear'));
		assert.isTrue(commitSpy.calledWith('add', {
			id: 1
		}));
		assert.deepEqual(response, {
			status: 'cached',
			data
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
			commit: commitSpy,
			state: {
				username: ''
			}
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

	it('Sets specific user', () => {
		const state = {
			username: ''
		};

		markersStore.mutations.setUser(state, 'user');

		assert.equal(state.username, 'user');
	});

	it('Updates page', () => {
		const state = {
			page: 1
		};

		markersStore.mutations.changePage(state, -1);

		assert.equal(state.page, 0);
	});


	it('Commits previous page when page is not already 0', () => {
		const state = {
			page: 1
		};
		const commit = sinon.spy();

		markersStore.actions.previousPage({
			state,
			commit
		}, 1);

		assert.isTrue(commit.calledOnce);
		assert.isTrue(commit.calledWith('changePage', -1));
	});


	it('Doesnt commit previous page when page is at 0', () => {
		const state = {
			page: 0
		};
		const commit = sinon.spy();

		markersStore.actions.previousPage({
			state,
			commit
		}, 1);

		assert.isFalse(commit.called);
	});

	it('Commits next page and loads from server when hasNext', async () => {
		const state = {
			markers: new Array(pageSize).fill({id: 1}),
			page: 0,
			hasNext: true
		};
		const commit = sinon.spy();
		const dispatch = sinon.spy();

		await markersStore.actions.nextPage({
			state,
			commit,
			dispatch
		}, 1);

		assert.isTrue(commit.calledOnce);
		assert.isTrue(commit.calledWith('changePage', 1));

		assert.isTrue(dispatch.calledOnce);
		assert.isTrue(dispatch.calledWith('load', 1));
	});

	it('Commits next page when not on last page', async () => {
		const state = {
			markers: new Array(pageSize + 5).fill({id: 1}),
			page: 0,
			hasNext: false
		};
		const commit = sinon.spy();
		const dispatch = sinon.spy();

		await markersStore.actions.nextPage({
			state,
			commit,
			dispatch
		}, 1);

		assert.isTrue(commit.calledOnce);
		assert.isTrue(commit.calledWith('changePage', 1));
	});


	it('Doesnt commit next page when page is at max and no next page', async () => {
		const state = {
			markers: [{}],
			page: 0,
			hasNext: false
		};
		const commit = sinon.spy();
		const dispatch = sinon.spy();

		await markersStore.actions.nextPage({
			state,
			commit,
			dispatch
		}, 1);

		assert.isFalse(commit.called);
	});
});