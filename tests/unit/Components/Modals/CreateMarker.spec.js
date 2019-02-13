import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import CreateMarker from '@/Components/Modals/CreateMarker';
import sinon from 'sinon';

describe('CreateMarker.vue', () => {

	const propsData = {
		latLng: {
			lat: 1,
			lng: 1,
		}
	};

	let mocks;

	beforeEach(() => {
		mocks = {
			$bus: {
				$on: sinon.stub()
			},
			$store: {
				dispatch: sinon.stub()
			},
			$modal: {
				hide: sinon.spy()
			}
		}
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Renders and initializes listeners', () => {
		const wrapper = shallowMount(CreateMarker, {
			propsData,
			mocks
		});

		assert.isTrue(wrapper.find('create-marker-type-toggle-stub').exists());
		assert.isTrue(wrapper.find('create-marker-file-field-stub').exists());
		assert.isTrue(wrapper.find('create-marker-type-toggle-stub').exists());
		assert.isTrue(wrapper.find('create-marker-date-time-field-stub').exists());
		assert.isTrue(wrapper.find('create-marker-type-field-stub').exists());
		assert.isTrue(mocks.$bus.$on.calledOnce);
		assert.isTrue(mocks.$bus.$on.calledWith('edit-marker', wrapper.vm.prefill));
	});

	it('Adds new marker to upload queue', async () => {
		const wrapper = shallowMount(CreateMarker, {
			propsData,
			mocks
		});

		const data = wrapper.vm.getData();

		wrapper.find('form').trigger('submit');

		await wrapper.vm.$nextTick();

		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('Uploads/upload', data));

		assert.isTrue(mocks.$modal.hide.calledOnce);
		assert.isTrue(mocks.$modal.hide.calledWith('create-marker'));
	});

	it('Returns old marker to upload queue', async () => {
		const wrapper = shallowMount(CreateMarker, {
			propsData,
			mocks
		});

		wrapper.setData({
			uploadId: 1
		});

		wrapper.find('form').trigger('submit');

		await wrapper.vm.$nextTick();
		const data = wrapper.vm.getData();
		data.uploadTime = 1;

		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('Uploads/returnToQueue', data));

		assert.isTrue(mocks.$modal.hide.calledOnce);
		assert.isTrue(mocks.$modal.hide.calledWith('create-marker'));
	});

	it('Shows cancel button when working with errored marker', () => {
		const wrapper = shallowMount(CreateMarker, {
			propsData,
			mocks
		});

		wrapper.setData({
			uploadId: 1
		});

		assert.isTrue(wrapper.find('button.is-danger').exists());
	});

	it('Cancels marker upload', async () => {
		const wrapper = shallowMount(CreateMarker, {
			propsData,
			mocks
		});

		wrapper.setData({
			uploadId: 1
		});

		wrapper.find('button.is-danger').trigger('click');

		await wrapper.vm.$nextTick();

		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('Uploads/cancelUpload', 1));

		assert.isTrue(mocks.$modal.hide.calledOnce);
		assert.isTrue(mocks.$modal.hide.calledWith('create-marker'));
	});

	it('Prefills data', () => {
		const wrapper = shallowMount(CreateMarker, {
			propsData,
			mocks
		});

		wrapper.vm.prefill({
			uploadTime: 1,
			description: 'test',
			type: 'Planned',
			time: 2,
			'media[type]': 'instagram',
			'media[path]': 'path',
			error: {
				status: 500
			}
		});

		assert.equal(wrapper.vm.$data.uploadId, 1);
		assert.deepEqual(wrapper.vm.$data.form, {
			media: {
				file: null,
				preview: "",
				type: 'instagram',
				path: 'path'
			},
			description: 'test',
			type: 'Planned',
			dateTime: 2,
		});
	});

	it('Prefills errors', async () => {
		const wrapper = shallowMount(CreateMarker, {
			propsData,
			mocks
		});

		wrapper.vm.prefill({
			uploadTime: 1,
			description: 'test',
			type: 'Planned',
			time: 2,
			'media[type]': 'instagram',
			'media[path]': 'path',
			error: {
				status: 422,
				data: {
					errors: [{
						param: 'media.path',
						msg: 'invalid'
					}]
				}
			}
		});

		assert.deepEqual(wrapper.vm.$data.errors, {
			'media.path': 'invalid'
		});

	});


	it('Resets form', () => {
		const wrapper = shallowMount(CreateMarker, {
			propsData,
			mocks
		});

		wrapper.setData({
			errors: [
				'test'
			],
			form: {
				object: 'test'
			}
		});

		wrapper.vm.resetForm();

		assert.equal(wrapper.vm.$data.errors, null);

		assert.include(wrapper.vm.$data.form, {
			description: '',
			type: 'Visited'
		});

		assert.include(wrapper.vm.$data.form.media, {
			type: 'image',
			file: null,
			path: ''
		});

	});

});
