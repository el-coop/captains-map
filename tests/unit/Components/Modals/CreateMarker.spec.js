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

	afterEach(() => {
		sinon.restore();
	});

	it('Renders', () => {
		const wrapper = shallowMount(CreateMarker, {
			propsData
		});

		assert.isTrue(wrapper.find('createmarkertypetoggle-stub').exists());
		assert.isTrue(wrapper.find('createmarkerfilefield-stub').exists());
		assert.isTrue(wrapper.find('createmarkertypetoggle-stub').exists());
		assert.isTrue(wrapper.find('createmarkerdatetimefield-stub').exists());
		assert.isTrue(wrapper.find('createmarkertypefield-stub').exists());
	});

	it('Reads errors', () => {
		const wrapper = shallowMount(CreateMarker, {
			propsData
		});

		const errors = {
			error: 'test'
		};

		wrapper.vm.getErrors(errors);

		assert.deepEqual(wrapper.vm.$data.errors, errors);
	});

	it('Reacts to submission', () => {
		const $store = {
			commit: sinon.spy()
		};
		const $modal = {
			hide: sinon.spy()
		};
		const wrapper = shallowMount(CreateMarker, {
			propsData,
			mocks: {
				$store,
				$modal
			}
		});
		const marker = {
			id: 1
		};


		wrapper.vm.submitted({
			status: 200,
			data: {
				marker
			}
		});

		assert.isTrue($store.commit.calledOnce);
		assert.isTrue($store.commit.calledWith('Markers/addAtStart'));

		assert.isTrue($modal.hide.calledOnce);
		assert.isTrue($modal.hide.calledWith('create-marker'));
	});

	it('Reacts to failed submission', () => {
		const $store = {
			commit: sinon.spy()
		};
		const $modal = {
			hide: sinon.spy()
		};

		const $toast = {
			error: sinon.spy()
		};

		const wrapper = shallowMount(CreateMarker, {
			propsData,
			mocks: {
				$store,
				$modal,
				$toast
			}
		});
		const marker = {
			id: 1
		};


		wrapper.vm.submitted({
			status: 201,
			data: {
				marker
			}
		});

		assert.isTrue($toast.error.calledOnce);
		assert.isTrue($toast.error.calledWith('Please try again at a later time', 'Creation failed.'));

		assert.isTrue($store.commit.notCalled);
		assert.isTrue($modal.hide.notCalled);
	});

	it('Resets form', () => {
		const wrapper = shallowMount(CreateMarker, {
			propsData
		});

		wrapper.setData({
			errors: [
				'test'
			],
			form: {
				object: 'test'
			}
		});

		// wrapper.find('ajaxform-stub').trigger('errors',errors);
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

	it('Test all create video field components');

});
