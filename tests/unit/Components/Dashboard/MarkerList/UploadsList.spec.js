import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import UploadsList from '@/Components/Dashboard/SideBar/UploadsList';
import sinon from 'sinon';


describe('UploadsList.vue', () => {
	let mocks;
	const stubs = {
		FontAwesomeIcon: true
	};

	beforeEach(() => {
		mocks = {
			$store: {
				getters: {
					'Uploads/allFiles': new Array(3).fill({lat: 0, lng: 0})
				}
			}
		}
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Renders', () => {
		const wrapper = shallowMount(UploadsList, {
			mocks,
			stubs
		});

		assert.isTrue(wrapper.find('button.is-faded').exists());
		assert.isFalse(wrapper.find('ul').exists());
	});

	it('Shows list when button clicked', () => {
		const wrapper = shallowMount(UploadsList, {
			mocks,
			stubs
		});

		wrapper.setData({
			open: false
		});

		wrapper.find('button.is-faded').trigger('click');
		assert.isTrue(wrapper.find('ul').exists());
	});


	it('Closes list when button clicked and list open', () => {
		const wrapper = shallowMount(UploadsList, {
			mocks,
			stubs
		});

		wrapper.setData({
			open: true
		});

		wrapper.find('button.is-faded').trigger('click');
		assert.isFalse(wrapper.find('ul').exists());
	});

	it('Lists all the different upload entries', () => {
		const wrapper = shallowMount(UploadsList, {
			mocks,
			stubs
		});

		wrapper.setData({
			open: true
		});

		assert.equal(wrapper.findAll('uploadentry-stub').length, 3);
	});
});
