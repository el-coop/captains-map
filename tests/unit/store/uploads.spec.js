import sinon from 'sinon';
import { assert } from 'chai';
import Store from '@/store';
import uploadsStore from '@/store/uploads';
import cache from '@/Services/cache.service';
import uploadService from '@/Services/UploadService';

describe('Marker Store', () => {

	afterEach('Reset sinon and settings', () => {
		sinon.restore();
	});

	it('returns all files', () => {
		uploadsStore.state.queue = [{id: 1}, {id: 2}];
		uploadsStore.state.errored = [{id: 3}, {id: 4}];

		assert.deepEqual(Store.getters['Uploads/allFiles'], [{id: 1}, {id: 2}, {id: 3}, {id: 4}]);
	});

	it('pushes to queue', () => {
		const state = {
			queue: []
		};
		uploadsStore.mutations.pushToQueue(state, {id: 1});

		assert.deepEqual(state.queue[0], {id: 1});
	});


	it('pushes to errored', () => {
		const state = {
			errored: []
		};
		uploadsStore.mutations.pushToErrored(state, {id: 1});

		assert.deepEqual(state.errored[0], {id: 1});
	});


	it('removes from queue', () => {
		const state = {
			queue: [{uploadTime: 1}, {uploadTime: 2}, {uploadTime: 3}]
		};
		uploadsStore.mutations.removeFromQueue(state, 2);

		assert.deepEqual(state.queue, [{uploadTime: 1}, {uploadTime: 3}]);
	});

	it('removes from errored', () => {
		const state = {
			errored: [{uploadTime: 1}, {uploadTime: 2}, {uploadTime: 3}]
		};
		uploadsStore.mutations.removeFromErrored(state, 1);

		assert.deepEqual(state.errored, [{uploadTime: 2}, {uploadTime: 3}]);
	});

	it('marks as working', () => {
		const state = {
			workingId: null
		};
		uploadsStore.mutations.markAsWorking(state, 1);

		assert.deepEqual(state.workingId, 1);
	});

	it('Doesnt process queue when there is no csrf', () => {
		const state = {
			loaded: true
		};
		const rootState = {
			hasCsrf: false
		};

		const uploadServiceStub = sinon.stub(uploadService, 'processQueue');

		uploadsStore.actions.processQueue({state, rootState});

		assert.isTrue(uploadServiceStub.notCalled);
	});

	it('Doesnt process queue when queue isnt loaded', () => {
		const state = {
			loaded: false
		};
		const rootState = {
			hasCsrf: true
		};

		const uploadServiceStub = sinon.stub(uploadService, 'processQueue');

		uploadsStore.actions.processQueue({state, rootState});

		assert.isTrue(uploadServiceStub.notCalled);
	});

	it('processes queue when queue is loaded and csrf is ready', () => {
		const state = {
			loaded: true
		};
		const rootState = {
			hasCsrf: true
		};

		const uploadServiceStub = sinon.stub(uploadService, 'processQueue');

		uploadsStore.actions.processQueue({state, rootState});

		assert.isTrue(uploadServiceStub.calledOnce);
	});

	it('initializes queue', async () => {
		const state = {
			errored: [],
			queue: [],
			loaded: false
		};
		const dispatch = sinon.stub();
		sinon.stub(cache.caches().uploads, 'iterate').callsFake((callback) => {
			callback({
				id: 1,
				error: 'bla'
			});
			callback({
				id: 2,
			});
			callback({
				id: 3,
			});
		});


		await uploadsStore.actions.init({state, dispatch});

		assert.isTrue(state.loaded);
		assert.isTrue(dispatch.calledOnce);
		assert.isTrue(dispatch.calledWith('processQueue'));
		assert.deepEqual(state.errored, [{
			id: 1,
			error: 'bla'
		}]);
		assert.deepEqual(state.queue, [{
			id: 2
		}, {
			id: 3
		}]);
	});

	it('marks marker for upload', async () => {
		const commit = sinon.stub();
		const cacheStub = sinon.stub(cache.caches().uploads, 'setItem');
		const uploadServiceStub = sinon.stub(uploadService, 'processQueue');

		const marker = {
			id: 1,
			'media[type]': 'instagram'
		};

		await uploadsStore.actions.upload({commit}, marker);

		assert.isTrue(commit.calledOnce);
		assert.isTrue(commit.calledWith('pushToQueue', marker));
		assert.isTrue(cacheStub.calledOnce);
		assert.isTrue(cacheStub.calledWith(marker.uploadTime, marker));
		assert.isTrue(uploadServiceStub.calledOnce);
	});

	it('cancels upload', async () => {
		const commit = sinon.stub();
		const cacheStub = sinon.stub(cache.caches().uploads, 'removeItem');

		await uploadsStore.actions.cancelUpload({commit}, 1);

		assert.isTrue(commit.calledOnce);
		assert.isTrue(commit.calledWith('removeFromErrored', 1));
		assert.isTrue(cacheStub.calledOnce);
		assert.isTrue(cacheStub.calledWith(1));
	});

	it('returns marker to queue', async () => {
		const commit = sinon.stub();
		const state = {};
		const uploadServiceStub = sinon.stub(uploadService, 'processQueue');

		const marker = {
			id: 1,
			uploadTime: 1,
			'media[type]': 'instagram'
		};

		await uploadsStore.actions.returnToQueue({state, commit}, marker);

		assert.isTrue(commit.calledTwice);
		assert.isTrue(commit.calledWith('pushToQueue', marker));
		assert.isTrue(commit.calledWith('removeFromErrored', 1));
		assert.isTrue(uploadServiceStub.calledOnce);
	});

	it('loads old image when new one isnt provided', async () => {
		const commit = sinon.stub();
		const state = {
			errored: [{
				uploadTime: 1,
				'media[image]': 'bla'
			}]
		};
		const uploadServiceStub = sinon.stub(uploadService, 'processQueue');

		const marker = {
			id: 1,
			uploadTime: 1,
			'media[type]': 'image'
		};

		await uploadsStore.actions.returnToQueue({state, commit}, marker);

		assert.isTrue(commit.calledTwice);
		assert.isTrue(commit.calledWith('pushToQueue', marker));
		assert.isTrue(commit.calledWith('removeFromErrored', 1));
		assert.isTrue(uploadServiceStub.calledOnce);
		assert.equal(marker['media[image]'], 'bla');
	});

	it('stays with new image when provided', async () => {
		const commit = sinon.stub();
		const state = {
			errored: [{
				uploadTime: 1,
				'media[image]': 'bla'
			}]
		};
		const uploadServiceStub = sinon.stub(uploadService, 'processQueue');

		const marker = {
			id: 1,
			uploadTime: 1,
			'media[type]': 'image',
			'media[image]': 'gla'
		};

		await uploadsStore.actions.returnToQueue({state, commit}, marker);

		assert.isTrue(commit.calledTwice);
		assert.isTrue(commit.calledWith('pushToQueue', marker));
		assert.isTrue(commit.calledWith('removeFromErrored', 1));
		assert.isTrue(uploadServiceStub.calledOnce);
		assert.equal(marker['media[image]'], 'gla');
	});

	it('moves marker from queue to error', async () => {
		const commit = sinon.stub();
		const cacheStub = sinon.stub(cache.caches().uploads, 'setItem');
		uploadsStore.actions._vm = {
			$toast: {
				error: sinon.stub()
			}
		};

		const marker = {
			id: 1,
			uploadTime: 1,
			'media[type]': 'image',
			'media[image]': 'gla'
		};

		await uploadsStore.actions.uploadError({commit}, marker);

		assert.isTrue(commit.calledTwice);
		assert.isTrue(commit.calledWith('pushToErrored', marker));
		assert.isTrue(commit.calledWith('removeFromQueue', 1));
		assert.isTrue(cacheStub.calledOnce);
		assert.isTrue(cacheStub.calledWith(1, marker));
		assert.isTrue(uploadsStore.actions._vm.$toast.error.calledOnce);
		assert.isTrue(uploadsStore.actions._vm.$toast.error.calledWith('Please try again later', 'Upload failed'));
	});

	it('removes marker from storage when uploaded', async () => {
		const commit = sinon.stub();
		const cacheStub = sinon.stub(cache.caches().uploads, 'removeItem');
		const marker = {
			id: 1,
			uploadTime: 1,
			'media[type]': 'image',
			'media[image]': 'gla'
		};

		await uploadsStore.actions.uploaded({commit}, marker);

		assert.isTrue(commit.calledTwice);
		assert.isTrue(commit.calledWith('Markers/addAtStart', marker, {
			root: true
		}));
		assert.isTrue(commit.calledWith('removeFromQueue', 1));
		assert.isTrue(cacheStub.calledOnce);
		assert.isTrue(cacheStub.calledWith(1));
	});

	it('Purges queue', async () => {
		const state = {
			queue: [{id: 1}],
			errored: [{id: 2}],
			workingId: 2,
		};
		const cacheStub = sinon.stub(cache.caches().uploads, 'clear');
		await uploadsStore.actions.purge({state});
		assert.isTrue(cacheStub.calledOnce);
		assert.deepEqual(state, {
			queue: [],
			errored: [],
			workingId: null,
		});
	});
});
