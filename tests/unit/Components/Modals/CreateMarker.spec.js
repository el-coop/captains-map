import { assert } from 'chai';
import { shallowMount, mount } from '@vue/test-utils';
import CreateMarker from '@/Components/Modals/CreateMarker';
import sinon from 'sinon';

describe('CreateMarker.vue', () => {

	const marker = {
		uploadTime: 1,
		description: 'test',
		type: 'Planned',
		location: 'location',
		time: new Date(2),
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
	};
	const latLng = {
		lat: 1,
		lng: 1,
	};
	let mocks;
	const stubs = {
		FontAwesomeIcon: true,
		TypeToggle: true,
		FileField: true,
		DateTimeField: true,
		SelectField: true
	};

	beforeEach(() => {
		mocks = {
			$bus: {
				$on: sinon.stub(),
				$off: sinon.stub(),
			},
			$store: {
				dispatch: sinon.stub()
			},
			$router: {
				pushRoute: sinon.stub(),
				back: sinon.stub(),
			},
		}
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Registers listeners', () => {
		shallowMount(CreateMarker, {
			stubs,
			mocks
		});

		assert.isTrue(mocks.$bus.$on.calledWith('map-create-marker'));
		assert.isTrue(mocks.$bus.$on.calledWith('user-marker-click'));
	});

	it('Unregisters listeners', () => {
		const wrapper = shallowMount(CreateMarker, {
			stubs,
			mocks
		});

		wrapper.destroy();

		assert.isTrue(mocks.$bus.$off.calledWith('map-create-marker'));
		assert.isTrue(mocks.$bus.$off.calledWith('user-marker-click'));
	});

	it('Shows empty form when there is no data marker', () => {
		const latlng = {
			lat: 0,
			lng: 0
		};
		const wrapper = shallowMount(CreateMarker, {
			stubs,
			mocks
		});

		wrapper.setData({
			modal: false
		});

		wrapper.vm.createMarker({
			event: {
				latlng
			}
		});

		assert.isTrue(wrapper.vm.$data.modal);
		assert.isNull(wrapper.vm.$data.marker);
		assert.deepEqual(wrapper.vm.$data.latLng, latlng);
		assert.deepInclude(wrapper.vm.$data.form, {
			media: {
				type: 'image',
				file: null,
				path: ''
			},
			location: '',
			description: '',
			type: 'Visited'
		});
	});

	it('Shows filled form when there is data marker', () => {
		const latlng = {
			lat: 0,
			lng: 0
		};
		const wrapper = shallowMount(CreateMarker, {
			stubs,
			mocks
		});

		wrapper.setData({
			modal: false,
		});

		wrapper.vm.createMarker({
			event: {
				latlng
			},
			marker
		});
		const date = new Date(2);

		assert.isTrue(wrapper.vm.$data.modal);
		assert.deepEqual(wrapper.vm.$data.marker, marker);
		assert.deepEqual(wrapper.vm.$data.latLng, latlng);
		assert.deepEqual(wrapper.vm.$data.form, {
			media: {
				file: null,
				preview: "",
				type: 'instagram',
				path: 'path'
			},
			description: 'test',
			location: 'location',
			type: 'Planned',
			dateTime: date.setMinutes(date.getMinutes() + date.getTimezoneOffset()),
		});
	});

	it('Renders entirely when modal is activated', () => {
		const wrapper = mount(CreateMarker, {
			mocks,
			stubs
		});

		wrapper.setData({
			modal: true
		});

		assert.isTrue(wrapper.find('typetoggle-stub').exists());
		assert.isTrue(wrapper.find('filefield-stub').exists());
		assert.isTrue(wrapper.find('datetimefield-stub').exists());
		assert.isTrue(wrapper.find('selectfield-stub').exists());
		assert.isTrue(wrapper.find('a').exists());
	});

	it('Closes modal with cancel button', async () => {
		const wrapper = mount(CreateMarker, {
			mocks,
			stubs
		});

		wrapper.setData({
			modal: true,
		});

		wrapper.find('.card-footer-item a').trigger('click');

		assert.isFalse(wrapper.vm.$data.modal);
	});

	it('hides when modal is not activated', () => {
		const wrapper = mount(CreateMarker, {
			mocks,
			stubs
		});

		wrapper.setData({
			modal: false
		});

		assert.isFalse(wrapper.find('typetoggle-stub').exists());
		assert.isFalse(wrapper.find('filefield-stub').exists());
		assert.isFalse(wrapper.find('datetimefield-stub').exists());
		assert.isFalse(wrapper.find('selectfield-stub').exists());
	});

	it('Adds new marker to upload queue', async () => {
		const wrapper = shallowMount(CreateMarker, {
			mocks
		});
		wrapper.setData({
			modal: true
		});

		const data = wrapper.vm.getData();

		wrapper.find('form').trigger('submit');

		await wrapper.vm.$nextTick();

		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('Uploads/upload', data));

		assert.isFalse(wrapper.vm.$data.modal);
	});

	it('Returns old marker to upload queue', async () => {
		const wrapper = shallowMount(CreateMarker, {
			mocks
		});
		wrapper.setData({
			modal: true,
			marker
		});

		wrapper.find('form').trigger('submit');

		await wrapper.vm.$nextTick();
		const data = wrapper.vm.getData();
		data.uploadTime = 1;

		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('Uploads/returnToQueue', data));

		assert.isFalse(wrapper.vm.$data.modal);
	});

	it('Shows cancel button when working with errored marker', () => {
		const wrapper = mount(CreateMarker, {
			mocks,
			stubs
		});

		wrapper.setData({
			modal: true,
			marker
		});

		assert.isTrue(wrapper.find('button.is-danger').exists());
	});

	it('Cancels marker upload', async () => {
		const wrapper = mount(CreateMarker, {
			mocks,
			stubs
		});

		wrapper.setData({
			modal: true,
			marker
		});


		wrapper.find('button.is-danger').trigger('click');

		await wrapper.vm.$nextTick();

		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('Uploads/cancelUpload', 1));

		assert.isFalse(wrapper.vm.$data.modal);
	});


	it('Prefills data', () => {
		const wrapper = shallowMount(CreateMarker, {
			mocks
		});
		wrapper.setData({
			modal: true,
			marker
		});

		wrapper.vm.prefill();

		const date = new Date(2);

		assert.deepEqual(wrapper.vm.$data.form, {
			media: {
				file: null,
				preview: "",
				type: 'instagram',
				path: 'path'
			},
			description: 'test',
			location: 'location',
			type: 'Planned',
			dateTime: date.setMinutes(date.getMinutes() + date.getTimezoneOffset()),
		});
	});

	it('Prefills errors', async () => {
		const wrapper = shallowMount(CreateMarker, {
			mocks
		});
		wrapper.setData({
			modal: true,
			marker
		});

		wrapper.vm.prefill();

		assert.deepEqual(wrapper.vm.$data.errors, {
			'media.path': 'invalid'
		});

	});


	it('Resets form', () => {
		const wrapper = shallowMount(CreateMarker, {
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
