import sinon from 'sinon';
import { assert } from 'chai';
import markersStore from '@/store/markers';
import http from '@/Services/http.service';
import cache from "@/Services/cache.service";

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

	it('Adds a marker to start', () => {
		const state = {
			markers: [{
				id: 2
			}]
		};

		markersStore.mutations.addAtStart(state, {
			id: 1,
			name: 'test'
		});

		assert.equal(state.markers.length, 2);
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
			hasNext: true,
			page: 1,
			serverPAge: 1,
			markers: [{
				id: 1,
				name: 'test',
			}]
		};

		markersStore.mutations.clear(state);

		assert.equal(state.markers.length, 0);
		assert.equal(state.hasNext, false);
		assert.equal(state.page, 0);
		assert.equal(state.serverPage, 0);
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

	it('Loads markers with boundries', async () => {
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
			borders: [{
				lat: 0,
				lng: 0
			}, {
				lat: 1,
				lng: 1
			}]
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
		assert.isTrue(getStub.calledWith('marker/?borders=' + JSON.stringify(state.borders)));
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

	it('Loads users markers with specific boundaries', async () => {
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
			username: 'test',
			borders: [{
				lat: 0,
				lng: 0
			}, {
				lat: 1,
				lng: 1
			}]

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
		assert.isTrue(getStub.calledWith('marker/test?borders=' + JSON.stringify(state.borders)));
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

	it('Loads markers from specific page', async () => {
		const data = {
			markers: [{
				id: 1
			}],

			pagination: {
				hasNext: true,
				page: 2
			}
		};
		const state = {
			hasNext: false,
			username: 'test',
			serverPage: 0
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
		}, {
			startingId: 2,
			pageIncluding: true
		});

		assert.isTrue(getStub.calledOnce);
		assert.isTrue(getStub.calledWith('marker/test/2'));
		assert.isTrue(commitSpy.calledOnce);
		assert.isTrue(commitSpy.calledWith('add', {
			id: 1
		}));
		assert.isTrue(state.hasNext);
		assert.equal(state.serverPage, 2);
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

		const cacheStub = sinon.stub(cache, 'store');

		markersStore.actions.toggleUserMarker({state});

		assert.isTrue(state.userMarker);
		assert.isTrue(cacheStub.calledWith('settings', 'userMarker', true));

	});

	it('Toggles userMarker off', () => {
		const state = {
			userMarker: true
		};
		const cacheStub = sinon.stub(cache, 'store');

		markersStore.actions.toggleUserMarker({state});

		assert.isFalse(state.userMarker);

		assert.isTrue(cacheStub.calledOnce);
		assert.isTrue(cacheStub.calledWith('settings', 'userMarker', false));
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
			markers: new Array(6).fill({}),
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

	it('Loads previous page from server when page is 0 and serverPage is bigger than 0', () => {
		const state = {
			page: 0,
			serverPage: 1,
		};
		const dispatch = sinon.spy();

		markersStore.actions.previousPage({
			state,
			commit: {},
			dispatch
		}, 1);

		assert.isTrue(dispatch.calledOnce);
		assert.isTrue(dispatch.calledWith('loadPrevious'));
		assert.equal(state.serverPage, 0);
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

	it('Loads previous page of markers', async () => {
		const data = {
			markers: [{
				id: 1
			}, {
				id: 2
			}],

			pagination: {
				hasNext: null,
				serverPage: null
			}
		};
		const state = {
			hasNext: false,
			serverPage: 1,
			username: 'nur',
			markers: [
				{id: 3}
			]
		};
		const getStub = sinon.stub(http, 'get').callsFake(() => {
			return {
				status: 200,
				data
			};
		});
		const commitSpy = sinon.spy();

		const response = await markersStore.actions.loadPrevious({
			commit: commitSpy,
			state
		});

		assert.isTrue(getStub.calledOnce);
		assert.isTrue(getStub.calledWith('marker/nur/3/previous'));
		assert.isTrue(commitSpy.calledTwice);
		assert.isTrue(commitSpy.calledWith('addAtStart', {
			id: 1
		}));
		assert.isTrue(commitSpy.calledWith('addAtStart', {
			id: 2
		}));
		assert.isFalse(state.hasNext);
		assert.deepEqual(response, {
			status: 200,
			data
		});
	});

	it('Loads previous page of markers in specific boundy', async () => {
		const data = {
			markers: [{
				id: 1
			}, {
				id: 2
			}],

			pagination: {
				hasNext: null,
				serverPage: null
			}
		};
		const state = {
			hasNext: false,
			serverPage: 1,
			username: 'nur',
			markers: [
				{id: 3}
			],
			borders: [{
				lat: 0,
				lng: 0
			}, {
				lat: 1,
				lng: 1
			}]
		};
		const getStub = sinon.stub(http, 'get').callsFake(() => {
			return {
				status: 200,
				data
			};
		});
		const commitSpy = sinon.spy();

		const response = await markersStore.actions.loadPrevious({
			commit: commitSpy,
			state
		});

		assert.isTrue(getStub.calledOnce);
		assert.isTrue(getStub.calledWith('marker/nur/3/previous?borders=' + JSON.stringify(state.borders)));
		assert.isTrue(commitSpy.calledTwice);
		assert.isTrue(commitSpy.calledWith('addAtStart', {
			id: 1
		}));
		assert.isTrue(commitSpy.calledWith('addAtStart', {
			id: 2
		}));
		assert.isFalse(state.hasNext);
		assert.deepEqual(response, {
			status: 200,
			data
		});
	});

	it('updates user markers profile photo when updated', () => {
		const state = {
			markers: [
				{
					user: {
						id: 1,
						username: 'test',
						bio: {
							path: 'old'
						}
					}
				}, {
					user: {
						id: 2,
						username: 'test',
						bio: {
							path: 'old'
						}
					}
				}, {
					user: {
						id: 3,
						username: 'test1',
						bio: {
							path: 'old'
						}
					}
				},
			],
		};

		markersStore.mutations.updateProfilePic(state, {username: 'test', path: 'new'});

		assert.equal(state.markers[0].user.bio.path, 'new');
		assert.equal(state.markers[1].user.bio.path, 'new');
		assert.equal(state.markers[2].user.bio.path, 'old');
	});
});
