import sinon from 'sinon';
import {describe, it, expect, afterEach} from 'vitest';
import store from '@/store';
import markersStore from '@/store/markers';
import http from '@/Services/HttpService';
import cache from "@/Services/Cache";

const pageSize = parseInt(import.meta.env.VITE_APP_PAGE_SIZE);

describe('Marker Store', () => {

	afterEach(() => {
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

		expect(state.markers.length).toBe(1);
		expect(state.markers[0]).toEqual({
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

		expect(state.markers.length).toBe(2);
		expect(state.markers[0]).toEqual({
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

		expect(state.markers.length).toBe(0);
		expect(state.markers).toEqual([]);
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

		expect(state.markers.length).toBe(0);
		expect(state.hasNext).toBe(false);
		expect(state.page).toBe(0);
		expect(state.serverPage).toBe(0);
		expect(state.markers).toEqual([]);
	});

	it('Removes markers on successful delete', async () => {
		const deleteStub = sinon.stub(http, 'delete').callsFake(() => {
			return true;
		});
		const commitSpy = sinon.spy();

		await markersStore.actions.delete({
			commit: commitSpy
		}, {
			id: 1
		});

		expect(deleteStub.calledOnce).toBeTruthy();
		expect(deleteStub.calledWith('marker/1')).toBeTruthy();
		expect(commitSpy.calledOnce).toBeTruthy();
		expect(commitSpy.calledWith('remove', 1)).toBeTruthy();
	});

	it('Keeps markers on failed delete', async () => {
		sinon.stub(http, 'delete').callsFake(() => {
			return false;
		});
		const commitSpy = sinon.spy();

		await markersStore.actions.delete({
			commit: commitSpy
		}, 1);

		expect(commitSpy.calledOnce).toBeFalsy();
		expect(commitSpy.calledWith('remove', 1)).toBeFalsy();
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

		expect(getStub.calledOnce).toBeTruthy();
		expect(getStub.calledWith('marker/')).toBeTruthy();
		expect(commitSpy.calledThrice).toBeTruthy();
		expect(commitSpy.calledWith('clear')).toBeTruthy();
		expect(commitSpy.calledWith('add', {
			id: 1
		})).toBeTruthy();
		expect(commitSpy.calledWith('add', {
			id: 2
		})).toBeTruthy();
		expect(state.hasNext).toBeFalsy();
		expect(response).toEqual({
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

		expect(getStub.calledOnce).toBeTruthy();
		expect(getStub.calledWith('marker/?borders=' + JSON.stringify(state.borders))).toBeTruthy();
		expect(commitSpy.calledThrice).toBeTruthy();
		expect(commitSpy.calledWith('clear')).toBeTruthy();
		expect(commitSpy.calledWith('add', {
			id: 1
		})).toBeTruthy();
		expect(commitSpy.calledWith('add', {
			id: 2
		})).toBeTruthy();
		expect(state.hasNext).toBeFalsy();
		expect(response).toEqual({
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

		expect(getStub.calledOnce).toBeTruthy();
		expect(getStub.calledWith('marker/?startingId=2')).toBeTruthy();
		expect(commitSpy.calledTwice).toBeTruthy();
		expect(commitSpy.calledWith('clear')).toBeFalsy();
		expect(commitSpy.calledWith('add', {
			id: 3
		})).toBeTruthy();
		expect(commitSpy.calledWith('add', {
			id: 4
		})).toBeTruthy();
		expect(state.hasNext).toBeFalsy();
		expect(response).toEqual({
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

		expect(getStub.calledOnce).toBeTruthy();
		expect(getStub.calledWith('marker/test')).toBeTruthy();
		expect(commitSpy.calledTwice).toBeTruthy();
		expect(commitSpy.calledWith('clear')).toBeTruthy();
		expect(commitSpy.calledWith('add', {
			id: 1
		})).toBeTruthy();
		expect(state.hasNext).toBeTruthy();
		expect(response).toEqual({
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

		expect(getStub.calledOnce).toBeTruthy();
		expect(getStub.calledWith('marker/test?borders=' + JSON.stringify(state.borders))).toBeTruthy();
		expect(commitSpy.calledTwice).toBeTruthy();
		expect(commitSpy.calledWith('clear')).toBeTruthy();
		expect(commitSpy.calledWith('add', {
			id: 1
		})).toBeTruthy();
		expect(state.hasNext).toBeTruthy();
		expect(response).toEqual({
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

		expect(getStub.calledOnce).toBeTruthy();
		expect(getStub.calledWith('marker/test/2')).toBeTruthy();
		expect(commitSpy.calledOnce).toBeTruthy();
		expect(commitSpy.calledWith('add', {
			id: 1
		})).toBeTruthy();
		expect(state.hasNext).toBeTruthy();
		expect(state.serverPage).toBe(2);
		expect(response).toEqual({
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

		expect(state.hasNext).toBeTruthy();
		expect(getStub.calledOnce).toBeTruthy();
		expect(getStub.calledWith('marker/')).toBeTruthy();
		expect(commitSpy.calledTwice).toBeTruthy();
		expect(commitSpy.calledWith('clear')).toBeTruthy();
		expect(commitSpy.calledWith('add', {
			id: 1
		}));
		expect(response).toEqual({
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

		expect(getStub.calledOnce).toBeTruthy();
		expect(getStub.calledWith('marker/')).toBeTruthy();
		expect(commitSpy.calledOnce).toBeTruthy();
		expect(commitSpy.calledWith('clear')).toBeTruthy();

		expect(response).toEqual({
			status: 403,
		});
	});

	it('Toggles userMarker on', () => {
		const state = {
			userMarker: false
		};

		const cacheStub = sinon.stub(cache, 'store');

		markersStore.actions.toggleUserMarker({state});

		expect(state.userMarker).toBeTruthy();
		expect(cacheStub.calledWith('settings', 'userMarker', true)).toBeTruthy();

	});

	it('Toggles userMarker off', () => {
		const state = {
			userMarker: true
		};
		const cacheStub = sinon.stub(cache, 'store');

		markersStore.actions.toggleUserMarker({state});

		expect(state.userMarker).toBeFalsy();

		expect(cacheStub.calledOnce).toBeTruthy();
		expect(cacheStub.calledWith('settings', 'userMarker', false)).toBeTruthy();
	});

	it('Sets specific user', () => {
		const state = {
			username: ''
		};

		markersStore.mutations.setUser(state, 'user');

		expect(state.username).toBe('user');
	});

	it('Updates page', () => {
		const state = {
			markers: new Array(6).fill({}),
			page: 1
		};

		markersStore.mutations.changePage(state, -1);

		expect(state.page).toBe(0);
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

		expect(commit.calledOnce).toBeTruthy();
		expect(commit.calledWith('changePage', -1)).toBeTruthy();
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

		expect(commit.called).toBeFalsy();
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

		expect(dispatch.calledOnce).toBeTruthy();
		expect(dispatch.calledWith('loadPrevious')).toBeTruthy();
		expect(state.serverPage).toBe(0);
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

		expect(commit.calledOnce).toBeTruthy();
		expect(commit.calledWith('changePage', 1)).toBeTruthy();

		expect(dispatch.calledOnce).toBeTruthy();
		expect(dispatch.calledWith('load', 1)).toBeTruthy();
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

		expect(commit.calledOnce).toBeTruthy();
		expect(commit.calledWith('changePage', 1)).toBeTruthy();
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

		expect(commit.called).toBeFalsy();
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

		expect(getStub.calledOnce).toBeTruthy();
		expect(getStub.calledWith('marker/nur/3/previous')).toBeTruthy();
		expect(commitSpy.calledTwice).toBeTruthy();
		expect(commitSpy.calledWith('addAtStart', {
			id: 1
		})).toBeTruthy();
		expect(commitSpy.calledWith('addAtStart', {
			id: 2
		})).toBeTruthy();
		expect(state.hasNext).toBeFalsy();
		expect(response).toEqual({
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

		expect(getStub.calledOnce).toBeTruthy();
		expect(getStub.calledWith('marker/nur/3/previous?borders=' + JSON.stringify(state.borders))).toBeTruthy();
		expect(commitSpy.calledTwice).toBeTruthy();
		expect(commitSpy.calledWith('addAtStart', {
			id: 1
		})).toBeTruthy();
		expect(commitSpy.calledWith('addAtStart', {
			id: 2
		})).toBeTruthy();
		expect(state.hasNext).toBeFalsy();
		expect(response).toEqual({
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

		expect(state.markers[0].user.bio.path).toBe('new');
		expect(state.markers[1].user.bio.path).toBe('new');
		expect(state.markers[2].user.bio.path).toBe('old');
	});
});
