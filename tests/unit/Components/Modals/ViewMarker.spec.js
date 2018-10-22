import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import ViewMarker from '@/Components/Modals/ViewMarker';
import sinon from 'sinon';
import auth from '@/Services/authentication.service';

describe('ViewMarker.vue', () => {
	let marker;

	beforeEach(() => {
		marker = {
			id: 1,
			user_id: 1,
			user: {
				username: 'test',
			},
			media: {
				type: 'image',
				path: 'test',
				id: 1
			}
		};
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Renders with photo content', () => {
		const wrapper = shallowMount(ViewMarker, {
			propsData: {
				marker
			}
		});

		assert.isTrue(wrapper.find('slideupmodal-stub').exists());
		assert.isTrue(wrapper.find('viewmarkerheader-stub').exists());
		assert.isTrue(wrapper.find('viewmarkercontent-stub').exists());
		assert.isTrue(wrapper.find('photo-stub').exists());
	});


	it('Renders with instagram content', () => {
		marker.media.type = 'instagram';
		const wrapper = shallowMount(ViewMarker, {
			propsData: {
				marker
			}
		});

		assert.isTrue(wrapper.find('slideupmodal-stub').exists());
		assert.isTrue(wrapper.find('viewmarkerheader-stub').exists());
		assert.isTrue(wrapper.find('viewmarkercontent-stub').exists());
		assert.isTrue(wrapper.find('instagram-stub').exists());
	});

	it('Shows delete button for markers user', () => {
		sinon.stub(auth, 'getUserDetails').returns({
			id: 1
		});
		const wrapper = shallowMount(ViewMarker, {
			propsData: {
				marker
			},
		});

		assert.isTrue(wrapper.find('button.is-danger').exists());
	});

	it('Doesnt show delete button for different user', () => {
		sinon.stub(auth, 'getUserDetails').returns({
			id: 2
		});
		const wrapper = shallowMount(ViewMarker, {
			propsData: {
				marker
			},
		});

		assert.isFalse(wrapper.find('button.is-danger').exists());
	});

	it('Calculates route name', () => {
		const wrapper = shallowMount(ViewMarker, {
			propsData: {
				marker
			},
		});

		assert.equal(wrapper.vm.routeName, 'test/1');
	});

	it('Deletes marker', async () => {
		const $modal = {
			hide: sinon.spy()
		};
		const dispatchStub = sinon.stub().returns(true);
		const wrapper = shallowMount(ViewMarker, {
			propsData: {
				marker
			},
			mocks: {
				$store: {
					dispatch: dispatchStub
				},
				$modal
			}
		});

		await wrapper.vm.deleteMarker();

		assert.isTrue(dispatchStub.calledOnce);
		assert.isTrue(dispatchStub.calledWith('Markers/delete', 1));
		assert.isTrue($modal.hide.calledOnce);
		assert.isTrue($modal.hide.calledWith('view-marker'));
	});

	it('Shows toas when deleteing a marker fails', async () => {
		const $toast = {
			error: sinon.spy()
		};
		const dispatchStub = sinon.stub().returns(false);
		const wrapper = shallowMount(ViewMarker, {
			propsData: {
				marker
			},
			mocks: {
				$store: {
					dispatch: dispatchStub
				},
				$toast
			}
		});

		await wrapper.vm.deleteMarker();

		assert.isTrue(dispatchStub.calledOnce);
		assert.isTrue(dispatchStub.calledWith('Markers/delete', 1));
		assert.isTrue($toast.error.calledOnce);
		assert.isTrue($toast.error.calledWith('Please try again at a later time', 'Delete failed.'));
	});
});
