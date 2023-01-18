import {describe, it, expect} from 'vitest';
import {shallowMount, mount} from '@vue/test-utils';
import MultiFileField from "@/Components/Modals/CreateMarker/MultiFileField.vue";
import EditImage from "@/Components/Modals/CreateMarker/EditImage.vue";
import sinon from 'sinon';
import ImageService from "@/Services/ImageService";
import UploadFile from "@/Classes/UploadFile";

describe('CreateMarker/MultiFileField.vue', () => {
	const stubs = {
		FontAwesomeIcon: true
	};

	it('Renders', () => {
		const wrapper = shallowMount(MultiFileField, {
			global: {
				stubs
			},
			props: {
				limit: 5
			},
		});

		expect(wrapper.find('.dropzone__input[type=file]').exists()).toBeTruthy();
		expect(wrapper.find('.help.is-danger').exists()).toBeFalsy();
		expect(wrapper.html().includes('Add images')).toBeTruthy();
		expect(wrapper.html().includes('Maximum 5')).toBeTruthy();
	});

	it('Renders error', () => {
		const wrapper = shallowMount(MultiFileField, {
			global: {
				stubs
			},
			props: {
				error: 'Error'
			},
		});


		expect(wrapper.find('.help.is-danger').exists()).toBeTruthy();
		expect(wrapper.find('.help.is-danger').text()).toBe('Error');

	});

	it('Renders preview', () => {
		const wrapper = shallowMount(MultiFileField, {
			global: {
				stubs
			},
			props: {
				preview: '/perv'
			},
		});

		expect(wrapper.find('.dropzone__preview-image').exists()).toBeTruthy();
		expect(wrapper.find('.dropzone__preview-image').attributes().src).toBe('/perv');
		expect(wrapper.find('.dropzone__preview-label-text').text()).toBe('Click to upload');

	});

	it('show image previews', async () => {
		const modelValue = {
			1: new UploadFile('name1', 'image1'),
			2: new UploadFile('name2', 'image2')
		};
		const wrapper = mount(MultiFileField, {
			global: {
				stubs
			},
			props: {
				modelValue
			},
		});

		await wrapper.vm.$nextTick();

		expect(wrapper.find(`img[src="${modelValue[1].preview}"]`).exists()).toBeTruthy();
		expect(wrapper.html()).toContain(modelValue[1].name);
		expect(wrapper.find(`img[src="${modelValue[2].preview}"]`).exists()).toBeTruthy();
		expect(wrapper.html()).toContain(modelValue[2].name);

		sinon.restore();
	});

	it('shows add images card when under limit', async () => {
		const modelValue = {
			1: new UploadFile('name1', 'image1'),
			2: new UploadFile('name2', 'image2')
		};
		const wrapper = shallowMount(MultiFileField, {
			global: {
				stubs
			},
			props: {
				modelValue,
				limit: 5
			},
		});

		expect(wrapper.html().includes('Add images')).toBeTruthy();
		expect(wrapper.html().includes('3 Left')).toBeTruthy();
	});

	it('Doesnt show add images card when at limit', async () => {
		const modelValue = {
			0: new UploadFile('name0', 'image0'),
			1: new UploadFile('name1', 'image1'),
			2: new UploadFile('name2', 'image2'),
			3: new UploadFile('name3', 'image3'),
			4: new UploadFile('name4', 'image4'),
		};
		const wrapper = shallowMount(MultiFileField, {
			global: {
				stubs
			},
			props: {
				modelValue,
				limit: 5
			},
		});

		expect(wrapper.html().includes('Add images')).toBeFalsy();
	});

	it('Adds images', async () => {
		const wrapper = shallowMount(MultiFileField, {
			global: {
				stubs
			},
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

		const emittedEvent = wrapper.emitted()['update:modelValue'][0][0];
		expect(Object.values(emittedEvent)).toEqual([
			new UploadFile('name', 'image'),
			new UploadFile('name1', 'image1')
		]);

		sinon.restore();
	});

	it('Adds images when some images already selected', async () => {
		const wrapper = shallowMount(MultiFileField, {
			global: {
				stubs
			},
		});


		sinon.stub(ImageService, 'imageToBlob')
			.onFirstCall().returns('image')
			.onSecondCall().returns('image1');

		await wrapper.setProps({
			modelValue: {
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

		const emittedEvent = wrapper.emitted()['update:modelValue'][0][0];
		expect(Object.values(emittedEvent)).toEqual([
			new UploadFile('name2', 'image2'),
			new UploadFile('name', 'image'),
			new UploadFile('name1', 'image1'),
		]);

		sinon.restore();
	});

	it('Adds doesnt add non images', async () => {
		const wrapper = shallowMount(MultiFileField, {
			global: {
				stubs
			},

		});

		sinon.stub(ImageService, 'imageToBlob')
			.onFirstCall().returns('image')
			.onSecondCall().returns('image1');

		await wrapper.setProps({
			modelValue: {
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

		const emittedEvent = wrapper.emitted()['update:modelValue'][0][0];
		expect(Object.values(emittedEvent)).toEqual([
			new UploadFile('name2', 'image2'),
			new UploadFile('name', 'image'),
		]);
	});

	it('Doesnt allow more fields than the limit', async () => {
		const modelValue = {
			0: new UploadFile('name0', 'image0'),
			1: new UploadFile('name1', 'image1'),
			2: new UploadFile('name2', 'image2'),
			3: new UploadFile('name3', 'image3'),
			4: new UploadFile('name4', 'image4'),
		};

		const wrapper = shallowMount(MultiFileField, {
			global: {
				stubs
			},
			props: {
				modelValue,
				limit: 5
			},
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

		const emittedEvent = wrapper.emitted()['update:modelValue'][0][0];
		expect(Object.values(emittedEvent)).toEqual(Object.values(modelValue));
		expect(Object.values(emittedEvent).length).toBe(5);

		sinon.restore();
	});

	it('Removes images', async () => {
		const wrapper = shallowMount(MultiFileField, {
			props: {
				modelValue: {
					a: new UploadFile('name', 'image'),
					b: new UploadFile('name1', 'image1'),
				}
			},
			global: {
				stubs
			},
		});

		wrapper.vm.removeImage('a');

		const emittedEvent = wrapper.emitted()['update:modelValue'][0][0];
		expect(Object.values(emittedEvent)).toEqual([new UploadFile('name1', 'image1')]);
	});

	it('Shows edit image button and calls component when clicked', async () => {
		const modelValue = {
			1: new UploadFile('name1', 'image1'),
			2: new UploadFile('name2', 'image2')
		};
		const wrapper = shallowMount(MultiFileField, {
			props: {
				modelValue
			},
			global: {
				stubs
			},
		});

		expect(wrapper.find(`img[src="${modelValue[1].preview}"]`).exists()).toBeTruthy();
		expect(wrapper.html()).toContain('<span>Edit</span>');

		wrapper.find('.dropzone__preview-edit').trigger('click');
		expect(wrapper.vm.$data.editedImage).toBe('1');


		sinon.restore();
	});


	it('Unsets edited image when EditImage is closed', async () => {

		const modelValue = {
			1: new UploadFile('name1', 'image1'),
		};
		const wrapper = shallowMount(MultiFileField, {
			props: {
				modelValue,
			},
			global: {
				stubs
			},
		});

		await wrapper.setData({
			editedImage: 1
		});

		wrapper.findComponent(EditImage).vm.$emit('close');

		expect(wrapper.vm.$data.editedImage).toBeNull();

		sinon.restore();
	});

	it('Removes image when EditImage emits delete', async () => {

		const modelValue = {
			1: new UploadFile('name1', 'image1'),
			2: new UploadFile('name2', 'image2')
		};
		const wrapper = shallowMount(MultiFileField, {
			props: {
				modelValue,
			},
			global: {
				stubs
			},
		});

		await wrapper.setData({
			editedImage: 2
		});

		wrapper.findComponent(EditImage).vm.$emit('delete');

		expect(wrapper.vm.$data.editedImage).toBeNull();
		const emittedEvent = wrapper.emitted()['update:modelValue'][0][0];
		expect(Object.values(emittedEvent)).toEqual([
			new UploadFile('name1', 'image1')
		]);

		sinon.restore();
	});

	it('Calls image rotate function when EditImage emitts save event', async () => {

		const rotateStub = sinon.stub(ImageService, 'rotate');
		const modelValue = {
			1: new UploadFile('name1', 'image1'),
		};
		const wrapper = shallowMount(MultiFileField, {
			props: {
				modelValue,
			},
			global: {
				stubs
			},
		});

		await wrapper.setData({
			editedImage: 1
		});

		wrapper.findComponent(EditImage).vm.$emit('save', {rotation: 90});

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(wrapper.vm.$data.editedImage).toBeNull();
		expect(rotateStub.calledOnce).toBeTruthy();
		expect(rotateStub.calledWith('image1', 90)).toBeTruthy();

		sinon.restore();
	});
});
