import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import UploadEntry from '@/Components/Dashboard/SideBar/UploadEntry';
import sinon from 'sinon';
import map from '@/Services/LeafletMapService';
import UploadFile from "@/Classes/UploadFile";

;

describe('UploadEntry.vue', () => {
	let marker;
	let mocks;
	const file = new UploadFile('name', 'image');

	beforeEach(() => {
		mocks = {
			$store: {
				state: {
					Uploads: {
						workingId: 1
					}
				}
			}
		};
		marker = {
			media: {
				type: 'image',
				path: 'https://www.instagram.com/p/path/',
				files: [
					file
				]
			},
			description: 'Z0ZX6tdEBGAZYYCJT1NPZ0ZX6tdEBGAZYYCJT1NPZ0ZX6tdEBGAZYYCJT1NP',
			lat: 1,
			lng: 1,
			user: {
				username: 'test'
			},
			time: '2018-10-06 15:43:57',
			uploadTime: 2
		};
	});


	afterEach(() => {
		sinon.restore();
	});

	it('Renders', () => {
		const wrapper = shallowMount(UploadEntry, {
			mocks,
			propsData: {
				marker
			}
		});

		assert.isTrue(wrapper.find('.media').exists());
		assert.isTrue(wrapper.find('.image').exists());
		assert.isTrue(wrapper.find('.media-content').exists());
		assert.equal(wrapper.find('.content > p').text(), 'Z0ZX6tdEBGAZYYCJT1NPZ0ZX6tdEBGAZYYCJT1NPZ0...');
	});

	it('Calculates image src for image type', () => {
		const wrapper = shallowMount(UploadEntry, {
			mocks,
			propsData: {
				marker
			}
		});

		assert.equal(wrapper.vm.$data.src, file.preview);
	});

	it('Calculates image src for instagram type', () => {
		marker.media.type = 'instagram';

		const wrapper = shallowMount(UploadEntry, {
			mocks,
			propsData: {
				marker
			}
		});

		assert.equal(wrapper.vm.$data.src, `https://instagram.com/p/path/media/`);
	});

	it('Reacts to click', () => {
		mocks.$bus = {
			$emit: sinon.spy()
		};
		const mapMoveStub = sinon.stub(map, 'move');
		const wrapper = shallowMount(UploadEntry, {
			propsData: {
				marker
			},
			mocks
		});

		wrapper.find('.media').trigger('click');

		assert.isTrue(mocks.$bus.$emit.calledOnce);
		assert.isTrue(mocks.$bus.$emit.calledWith('moving-map'));
		assert.isTrue(mapMoveStub.calledOnce);
		assert.isTrue(mapMoveStub.calledWith([1, 1], 16));
	});

	it('Sets classname to queued when queued', () => {
		const wrapper = shallowMount(UploadEntry, {
			mocks,
			propsData: {
				marker
			}
		});
		assert.equal(wrapper.vm.$data.className, 'queued');
		assert.isTrue(wrapper.find('.queued').exists());
	});

	it('Sets classname to uploading when uploading', () => {
		const wrapper = shallowMount(UploadEntry, {
			mocks,
			propsData: {
				marker
			}
		});

		mocks.$store.state.Uploads.workingId = 2;

		assert.equal(wrapper.vm.$data.className, 'uploading');
		assert.isTrue(wrapper.find('.uploading').exists());
	});

	it('Sets classname to error when has errors', () => {
		marker.error = {
			test: 'best'
		};

		const wrapper = shallowMount(UploadEntry, {
			mocks,
			propsData: {
				marker
			}
		});

		assert.equal(wrapper.vm.$data.className, 'error');
		assert.isTrue(wrapper.find('.error').exists());
	});

	it('Updates marker preview when changed', () => {
		const marker2 = {
			media: {
				type: 'image',
				path: 'https://www.instagram.com/p/path/',
				files: [
					new UploadFile('name1','image1')
				]
			},
			description: 'Z0ZX6tdEBGAZYYCJT1NPZ0ZX6tdEBGAZYYCJT1NPZ0ZX6tdEBGAZYYCJT1NP',
			lat: 1,
			lng: 1,
			user: {
				username: 'test'
			},
			time: '2018-10-06 15:43:57',
			uploadTime: 2
		};

		const wrapper = shallowMount(UploadEntry, {
			mocks,
			propsData: {
				marker
			}
		});

		assert.equal(wrapper.vm.$data.src, file.preview);

		wrapper.setProps({
			marker: marker2
		});

		assert.equal(wrapper.vm.$data.src, marker2.media.files[0].preview);

	});
});

