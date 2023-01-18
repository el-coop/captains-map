import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import {shallowMount, mount} from '@vue/test-utils';
import CreateMarker from '@/Components/Modals/CreateMarker.vue';
import sinon, {mock} from 'sinon';
import UploadFile from "@/Classes/UploadFile";
import {createStore} from "vuex";

describe('CreateMarker.vue', () => {

	let marker;
	let storeOptions;
	let mocks;
	const stubs = {
		FontAwesomeIcon: true,
		TypeToggle: true,
		MultiFileField: true,
		DateTimeField: true,
		SelectField: true
	};

	beforeEach(() => {
		storeOptions = {
			modules: {
				Stories: {
					namespaced: true,
					state: {
						story: null
					}
				},
				Uploads: {
					namespaced: true,
					actions: {
						upload() {
						},
						returnToQueue() {
						},
						cancelUpload() {
						}
					}
				}

			}
		};
		marker = {
			uploadTime: 1,
			lat: 0,
			lng: 0,
			description: 'test',
			type: 'Planned',
			location: 'location',
			time: new Date(2),
			media: {
				type: 'instagram',
				path: 'path',
				files: [
					new UploadFile('name', 'image'),
					new UploadFile('name1', 'image1'),
				]
			},
			error: {
				status: 422,
				data: {
					errors: [{
						param: 'media.path',
						msg: 'invalid'
					}]
				}
			}
		};
		mocks = {
			$router: {
				pushRoute: sinon.stub(),
				back: sinon.stub(),
			},
		}
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Shows empty form when there is no data marker', async () => {
		const latlng = {
			lat: 0,
			lng: 0
		};
		const wrapper = shallowMount(CreateMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: false
		});

		wrapper.vm.createMarker({
			event: {
				latlng
			}
		});

		expect(wrapper.vm.$data.modal).toBeTruthy();
		expect(wrapper.vm.$data.marker).toBeNull();
		expect(wrapper.vm.$data.form).toMatchObject({
			story: null,
			media: {
				type: 'image',
				files: {},
				path: ''
			},
			lat: 0,
			lng: 0,
			location: '',
			description: '',
			type: 'Visited'
		});
	});

	it('Shows empty form with story id when there is no data marker but there is a story', async () => {
		storeOptions.modules.Stories.state.story = {
			id: 1
		};

		const latlng = {
			lat: 0,
			lng: 0
		};
		const wrapper = shallowMount(CreateMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: false
		});

		wrapper.vm.createMarker({
			event: {
				latlng
			}
		});

		expect(wrapper.vm.$data.modal).toBeTruthy();
		expect(wrapper.vm.$data.marker).toBeNull();
		expect(wrapper.vm.$data.form).toMatchObject({
			story: 1,
			media: {
				type: 'image',
				files: {},
				path: ''
			},
			lat: 0,
			lng: 0,
			location: '',
			description: '',
			type: 'Visited'
		});
	});

	it('Shows filled form when there is data marker', async () => {
		const latlng = {
			lat: 0,
			lng: 0
		};
		const wrapper = shallowMount(CreateMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: false,
		});

		wrapper.vm.createMarker({
			event: {
				latlng,
				marker

			},
		});
		const date = new Date(2);

		expect(wrapper.vm.$data.modal).toBeTruthy();
		expect(wrapper.vm.$data.marker).toMatchObject(marker);
		expect(wrapper.vm.$data.form).toMatchObject({
			media: {
				type: 'instagram',
				path: 'path',
				files: [
					new UploadFile('name', 'image'),
					new UploadFile('name1', 'image1'),
				]
			},
			story: null,
			lat: 0,
			lng: 0,
			description: 'test',
			location: 'location',
			type: 'Planned',
			time: date.setMinutes(date.getMinutes() + date.getTimezoneOffset()),
		});
	});

	it('Shows filled form when there is data marker with original story', async () => {
		const latlng = {
			lat: 0,
			lng: 0
		};
		marker.story = 1;

		const wrapper = shallowMount(CreateMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: false,
		});

		wrapper.vm.createMarker({
			event: {
				latlng,
				marker
			},
		});
		const date = new Date(2);

		expect(wrapper.vm.$data.modal).toBeTruthy();
		expect(wrapper.vm.$data.marker).toMatchObject(marker);
		expect(wrapper.vm.$data.form).toMatchObject({
			media: {
				type: 'instagram',
				path: 'path',
				files: [
					new UploadFile('name', 'image'),
					new UploadFile('name1', 'image1'),
				]
			},
			story: 1,
			lat: 0,
			lng: 0,
			description: 'test',
			location: 'location',
			type: 'Planned',
			time: date.setMinutes(date.getMinutes() + date.getTimezoneOffset()),
		});
	});

	it('Renders entirely when modal is activated', async () => {
		const wrapper = mount(CreateMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: true
		});

		expect(wrapper.find('type-toggle-stub').exists()).toBeTruthy();
		expect(wrapper.find('multi-file-field-stub').exists()).toBeTruthy();
		expect(wrapper.find('date-time-field-stub').exists()).toBeTruthy();
		expect(wrapper.find('select-field-stub').exists()).toBeTruthy();
		expect(wrapper.find('a').exists()).toBeTruthy();
	});

	it('Closes modal with cancel button', async () => {
		const wrapper = mount(CreateMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: true,
		});

		wrapper.find('.card__footer-item a').trigger('click');

		expect(wrapper.vm.$data.modal).toBeFalsy();
	});

	it('hides when modal is not activated', async () => {
		const wrapper = mount(CreateMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: false
		});

		expect(wrapper.find('type-toggle-stub').exists()).toBeFalsy();
		expect(wrapper.find('file-field-stub').exists()).toBeFalsy();
		expect(wrapper.find('date-time-field-stub').exists()).toBeFalsy();
		expect(wrapper.find('select-field-stub').exists()).toBeFalsy();
	});

	it('Adds new marker to upload queue', async () => {
		const uploadStub = sinon.stub();
		storeOptions.modules.Uploads.actions.upload = uploadStub;
		const wrapper = shallowMount(CreateMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});
		await wrapper.setData({
			modal: true
		});

		wrapper.find('form').trigger('submit');

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(uploadStub.calledOnce).toBeTruthy();
		expect(uploadStub.calledWith(sinon.match.any, wrapper.vm.$data.form)).toBeTruthy();

		expect(wrapper.vm.$data.modal).toBeFalsy();
	});

	it('Returns old marker to upload queue', async () => {
		const returnToQueueStub = sinon.stub();
		storeOptions.modules.Uploads.actions.returnToQueue = returnToQueueStub;

		const wrapper = shallowMount(CreateMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});
		await wrapper.setData({
			modal: true,
			marker
		});
		wrapper.vm.prefill();
		wrapper.find('form').trigger('submit');

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(returnToQueueStub.calledOnce).toBeTruthy();
		expect(returnToQueueStub.calledWith(sinon.match.any, {
			...wrapper.vm.$data.form,
			uploadTime: marker.uploadTime
		})).toBeTruthy();

		expect(wrapper.vm.$data.modal).toBeFalsy();
	});

	it('Shows cancel button when working with errored marker', async () => {
		const wrapper = mount(CreateMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: true,
			marker
		});

		expect(wrapper.find('button.is-danger-background').exists()).toBeTruthy();
	});

	it('Cancels marker upload', async () => {
		const cancelUploadStub = sinon.stub();
		storeOptions.modules.Uploads.actions.cancelUpload = cancelUploadStub;
		stubs.BaseModal = false;

		const wrapper = shallowMount(CreateMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			modal: true,
			marker
		});

		wrapper.find('button.is-danger-background').trigger('click');

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});


		expect(cancelUploadStub.calledOnce).toBeTruthy();
		expect(cancelUploadStub.calledWith(sinon.match.any, 1)).toBeTruthy();

		expect(wrapper.vm.$data.modal).toBeFalsy();
	});


	it('Prefills data', async () => {
		const wrapper = shallowMount(CreateMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});
		await wrapper.setData({
			modal: true,
			marker
		});

		wrapper.vm.prefill();

		const date = new Date(2);

		expect(wrapper.vm.$data.form).toMatchObject({
			media: {
				files: [
					new UploadFile('name', 'image'),
					new UploadFile('name1', 'image1'),
				],
				type: 'instagram',
				path: 'path',
			},
			story: null,
			lat: 0,
			lng: 0,
			description: 'test',
			location: 'location',
			type: 'Planned',
			time: date.setMinutes(date.getMinutes() + date.getTimezoneOffset()),
		});
	});

	it('Prefills data with marker story', async () => {
		marker.story = 1;

		const wrapper = shallowMount(CreateMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});
		await wrapper.setData({
			modal: true,
			marker
		});

		wrapper.vm.prefill();

		const date = new Date(2);

		expect(wrapper.vm.$data.form).toMatchObject({
			media: {
				files: [
					new UploadFile('name', 'image'),
					new UploadFile('name1', 'image1'),
				],
				type: 'instagram',
				path: 'path',
			},
			story: 1,
			lat: 0,
			lng: 0,
			description: 'test',
			location: 'location',
			type: 'Planned',
			time: date.setMinutes(date.getMinutes() + date.getTimezoneOffset()),
		});
	});

	it('Prefills errors', async () => {
		const wrapper = shallowMount(CreateMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});
		await wrapper.setData({
			modal: true,
			marker
		});

		wrapper.vm.prefill();

		expect(wrapper.vm.$data.errors).toMatchObject({
			'media.path': 'invalid'
		});

	});


	it('Resets form', async () => {
		const wrapper = shallowMount(CreateMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.setData({
			errors: [
				'test'
			],
			form: {
				object: 'test'
			}
		});

		wrapper.vm.resetForm();

		expect(wrapper.vm.$data.errors).toBeNull();

		expect(wrapper.vm.$data.form).toMatchObject({
			description: '',
			type: 'Visited'
		});

		expect(wrapper.vm.$data.form.media).toMatchObject({
			type: 'image',
			files: {},
			path: ''
		});

	});

});
