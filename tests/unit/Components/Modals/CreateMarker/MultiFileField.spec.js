import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import MultiFileField from "@/Components/Modals/CreateMarker/MultiFileField";
import EditImage from "@/Components/Modals/CreateMarker/EditImage";
import sinon from 'sinon';
import ImageService from "@/Services/ImageService";
import UploadFile from "@/Classes/UploadFile";

describe('CreateMarker/MultiFileField.vue', () => {
	const stubs = {
		FontAwesomeIcon: true
	};

	it('Renders', () => {
		const wrapper = shallowMount(MultiFileField, {
			propsData: {
				limit: 5
			},
			stubs
		});

		assert.isTrue(wrapper.find('.dropzone__input[type=file]').exists());
		assert.isFalse(wrapper.find('.help.is-danger').exists());
		assert.isTrue(wrapper.html().includes('Add images'));
		assert.isTrue(wrapper.html().includes('Maximum 5'));
	});

	it('Renders error', () => {
		const wrapper = shallowMount(MultiFileField, {
			stubs,
			propsData: {
				error: 'Error'
			},
		});


		assert.isTrue(wrapper.find('.help.is-danger').exists());
		assert.equal(wrapper.find('.help.is-danger').text(), 'Error');

	});

	it('Renders preview', () => {
		const wrapper = shallowMount(MultiFileField, {
			stubs,
			propsData: {
				preview: '/perv'
			},
		});


		assert.isTrue(wrapper.find('.dropzone__preview-image').exists());
		assert.equal(wrapper.find('.dropzone__preview-image').attributes().src, '/perv');
		assert.equal(wrapper.find('.dropzone__preview-label-text').text(), 'Click to upload');

	});

	it('show image previews', async () => {
		const value = {
			1: new UploadFile('name1', 'image1'),
			2: new UploadFile('name2', 'image2')
		};
		const wrapper = shallowMount(MultiFileField, {
			propsData: {
				value
			},
			stubs
		});

		assert.isTrue(wrapper.find(`img[src="${value[1].preview}"]`).exists());
		assert.include(wrapper.html(), value[1].name);
		assert.isTrue(wrapper.find(`img[src="${value[2].preview}"]`).exists());
		assert.include(wrapper.html(), value[2].name);

		sinon.restore();
	});

	it('shows add images card when under limit', async () => {
		const value = {
			1: new UploadFile('name1', 'image1'),
			2: new UploadFile('name2', 'image2')
		};
		const wrapper = shallowMount(MultiFileField, {
			propsData: {
				value,
				limit: 5
			},
			stubs
		});

		assert.isTrue(wrapper.html().includes('Add images'));
		assert.isTrue(wrapper.html().includes('3 Left'));
	});

	it('Doesnt show add images card when at limit', async () => {
		const value = {
			0: new UploadFile('name0', 'image0'),
			1: new UploadFile('name1', 'image1'),
			2: new UploadFile('name2', 'image2'),
			3: new UploadFile('name3', 'image3'),
			4: new UploadFile('name4', 'image4'),
		};
		const wrapper = shallowMount(MultiFileField, {
			propsData: {
				value,
				limit: 5
			},
			stubs
		});


		assert.isFalse(wrapper.html().includes('Add images'));
	});

	it('Adds images', async () => {
		const wrapper = shallowMount(MultiFileField, {
			stubs
		});

		sinon.stub(ImageService, 'imageToBlob')
			.onFirstCall().returns('image')
			.onSecondCall().returns('image1');

		await wrapper.vm.imageAdded({
			target: {
				files: [{
					name: 'name',
					image: 'image',
					type: 'image/jpeg'
				}, {
					name: 'name1',
					image: 'image',
					type: 'image/jpeg'
				}]
			}
		});

		const emittedEvent = wrapper.emitted().input[0][0];
		assert.deepEqual(Object.values(emittedEvent), [
			new UploadFile('name', 'image'),
			new UploadFile('name1', 'image1')
		]);

		sinon.restore();
	});

	it('Adds images when some images already selected', async () => {
		const wrapper = shallowMount(MultiFileField, {
			stubs
		});

		sinon.stub(ImageService, 'imageToBlob')
			.onFirstCall().returns('image')
			.onSecondCall().returns('image1');

		wrapper.setProps({
			value: {
				'asd': new UploadFile('name2', 'image2')
			}
		});

		await wrapper.vm.imageAdded({
			target: {
				files: [{
					name: 'name',
					image: 'image',
					type: 'image/jpeg'
				}, {
					name: 'name1',
					image: 'image',
					type: 'image/jpeg'
				}]
			}
		});

		const emittedEvent = wrapper.emitted().input[0][0];
		assert.deepEqual(Object.values(emittedEvent), [
			new UploadFile('name2', 'image2'),
			new UploadFile('name', 'image'),
			new UploadFile('name1', 'image1'),
		]);

		sinon.restore();
	});

	it('Adds doesnt add non images', async () => {
		const wrapper = shallowMount(MultiFileField, {
			stubs
		});

		sinon.stub(ImageService, 'imageToBlob')
			.onFirstCall().returns('image')
			.onSecondCall().returns('image1');

		wrapper.setProps({
			value: {
				'asd': new UploadFile('name2', 'image2')
			}
		});

		await wrapper.vm.imageAdded({
			target: {
				files: [{
					name: 'name',
					image: 'image',
					type: 'image/jpeg'
				}, {
					name: 'name1',
					image: 'image',
					type: 'app/pdf'
				}]
			}
		});

		const emittedEvent = wrapper.emitted().input[0][0];
		assert.deepEqual(Object.values(emittedEvent), [
			new UploadFile('name2', 'image2'),
			new UploadFile('name', 'image'),
		]);

		sinon.restore();
	});

	it('Doesnt allow more fields than the limit', async () => {
		const value = {
			0: new UploadFile('name0', 'image0'),
			1: new UploadFile('name1', 'image1'),
			2: new UploadFile('name2', 'image2'),
			3: new UploadFile('name3', 'image3'),
			4: new UploadFile('name4', 'image4'),
		};

		const wrapper = shallowMount(MultiFileField, {
			propsData: {
				limit: 5,
				value
			},
			stubs
		});

		await wrapper.vm.imageAdded({
			target: {
				files: [{
					name: 'name6',
					image: 'image',
					type: 'image/jpeg'
				}, {
					name: 'name7',
					image: 'image',
					type: 'app/pdf'
				}]
			}
		});

		const emittedEvent = wrapper.emitted().input[0][0];
		assert.deepEqual(Object.values(emittedEvent), Object.values(value));
		assert.equal(Object.values(emittedEvent).length, 5);

		sinon.restore();
	});

	it('Removes images', async () => {
		const wrapper = shallowMount(MultiFileField, {
			propsData: {
				value: {
					a: new UploadFile('name', 'image'),
					b: new UploadFile('name1', 'image1'),
				}
			},
			stubs
		});

		wrapper.vm.removeImage('a');

		const emittedEvent = wrapper.emitted().input[0][0];
		assert.deepEqual(Object.values(emittedEvent), [
			new UploadFile('name1', 'image1')
		]);
	});

	it('Shows edit image button and calls component when clicked', async () => {
		const value = {
			1: new UploadFile('name1', 'image1'),
			2: new UploadFile('name2', 'image2')
		};
		const wrapper = shallowMount(MultiFileField, {
			propsData: {
				value
			},
			stubs
		});

		assert.isTrue(wrapper.find(`img[src="${value[1].preview}"]`).exists());
		assert.include(wrapper.html(), '<span>Edit</span>');

		wrapper.find('.dropzone__preview-edit').trigger('click');
		assert.equal(wrapper.vm.$data.editedImage, 1);


		sinon.restore();
	});


	it('Unsets edited image when EditImage is closed', async () => {

		const value = {
			1: new UploadFile('name1', 'image1'),
		};
		const wrapper = shallowMount(MultiFileField, {
			propsData: {
				value,
			},
			stubs
		});

		wrapper.setData({
			editedImage: 1
		});

		wrapper.find(EditImage).vm.$emit('close');

		assert.equal(wrapper.vm.$data.editedImage, null);

		sinon.restore();
	});

	it('Removes image when EditImage emits delete', async () => {

		const value = {
			1: new UploadFile('name1', 'image1'),
			2: new UploadFile('name2', 'image2')
		};
		const wrapper = shallowMount(MultiFileField, {
			propsData: {
				value,
			},
			stubs
		});

		wrapper.setData({
			editedImage: 2
		});

		wrapper.find(EditImage).vm.$emit('delete');

		assert.equal(wrapper.vm.$data.editedImage, null);
		const emittedEvent = wrapper.emitted().input[0][0];
		assert.deepEqual(Object.values(emittedEvent), [
			new UploadFile('name1', 'image1')
		]);

		sinon.restore();
	});

	it('Calls image rotate function when EditImage emitts save event', async () => {

		const rotateStub = sinon.stub(ImageService, 'rotate');
		const value = {
			1: new UploadFile('name1', 'image1'),
		};
		const wrapper = shallowMount(MultiFileField, {
			propsData: {
				value,
			},
			stubs
		});

		wrapper.setData({
			editedImage: 1
		});

		wrapper.find(EditImage).vm.$emit('save',{rotation: 90});

		await wrapper.vm.$nextTick();

		assert.equal(wrapper.vm.$data.editedImage, null);
		assert.isTrue(rotateStub.calledOnce);
		assert.isTrue(rotateStub.calledWith('image1',90));


		sinon.restore();
	});
});
