import {describe, it, expect} from 'vitest';
import {mount, shallowMount} from '@vue/test-utils';
import EditImage from "@/Components/Modals/CreateMarker/EditImage.vue";
import sinon from 'sinon';
import ImageService from "@/Services/ImageService";
import UploadFile from "@/Classes/UploadFile";
import BaseModal from "@/Components/Utilities/BaseModal.vue";

describe('CreateMarker/EditImage.vue', () => {
	const stubs = {
		FontAwesomeIcon: true
	};

	it('Renders closed modal when no image', () => {
		const wrapper = mount(EditImage, {
			global:{
				stubs
			}
		});

		expect(wrapper.find('.view-marker__image-img').exists()).toBeFalsy();
		expect(wrapper.find('.modal').exists()).toBeTruthy();
		expect(wrapper.vm.$data.modal).toBeFalsy();
	});


	it('Opens modal when has image', async () => {

		const image =  new UploadFile('name', 'image');
		const wrapper = mount(EditImage, {
			global:{
				stubs
			}
		});

		await wrapper.setProps({
			image
		});
		await wrapper.vm.$nextTick();

		expect(wrapper.vm.$data.modal).toBeTruthy();
		expect(wrapper.find('.view-marker__image-img').exists()).toBeTruthy();
		expect(wrapper.find('.view-marker__image-img').attributes().src).toBe(image.preview);
	});

	it('Emits close on modal close', async () => {

		const wrapper = mount(EditImage, {
			props: {
				image:  new UploadFile('name', 'image')
			},
			global:{
				stubs
			}
		});

		wrapper.findComponent(BaseModal).vm.$emit('close');

		const emittedEvent = wrapper.emitted().close[0];
		expect(Object.values(emittedEvent)).toEqual([]);
	});

	it('Closes modal when props image removed', async () => {

		const wrapper = mount(EditImage, {
			global:{
				stubs
			}
		});

		await wrapper.setProps({
			image: new UploadFile('name', 'image')
		});
		await wrapper.setData({
			rotation: 90,
			preview: 'bla'
		});
		await wrapper.vm.$nextTick();

		await wrapper.setProps({image: null})

		expect(wrapper.find('.view-marker__image-img').exists()).toBeFalsy();
		expect(wrapper.find('.modal').exists()).toBeTruthy();
		expect(wrapper.vm.$data.modal).toBeFalsy();
		expect(wrapper.vm.$data.preview).toBeNull();
		expect(wrapper.vm.$data.rotation).toBe(0);

	});

	it('Emits delete marker when delete clicked', async () => {

		const wrapper = mount(EditImage, {
			global:{
				stubs
			}
		});

		await wrapper.setProps({
			image: new UploadFile('name', 'image')
		});
		await wrapper.vm.$nextTick();

		wrapper.find('.button.is-danger-background').trigger('click');

		const emittedEvent = wrapper.emitted().delete[0];
		expect(Object.values(emittedEvent)).toEqual([]);

	});

	it('Emits save marker when save clicked', async () => {

		const wrapper = mount(EditImage, {
			global:{
				stubs
			}
		});

		await wrapper.setProps({
			image: new UploadFile('name', 'image')
		});
		await wrapper.vm.$nextTick();

		await wrapper.setData({
			rotation: 90
		})

		wrapper.find('.button.is-primary-background').trigger('click');

		const emittedEvent = wrapper.emitted().save[0];
		expect(Object.values(emittedEvent)).toEqual([{rotation: 90}]);

	});

	it('Rotates image when rotate clicked', async () => {

		const rotateStub = sinon.stub(ImageService,'rotate').returns('rotatedImage');

		const wrapper = mount(EditImage, {
			global:{
				stubs
			}
		});

		await wrapper.setProps({
			image: new UploadFile('name', 'image')
		});
		await wrapper.vm.$nextTick();

		wrapper.find('.button.is-selected-background').trigger('click');

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(wrapper.vm.$data.rotation).toBe(90);
		expect(wrapper.find('.view-marker__image-img').attributes().src).toBe('data:image/jpeg;base64,' + btoa('rotatedImage'));
		expect(rotateStub.calledOnce).toBeTruthy();
		expect(rotateStub.calledWith('image', 90)).toBeTruthy();

		sinon.restore();
	});

});
