import {assert} from 'chai';
import {mount, shallowMount} from '@vue/test-utils';
import EditImage from "@/Components/Modals/CreateMarker/EditImage";
import sinon from 'sinon';
import ImageService from "@/Services/ImageService";
import UploadFile from "@/Classes/UploadFile";
import BaseModal from "@/Components/Utilities/BaseModal";

describe('CreateMarker/EditImage.vue', () => {
	const stubs = {
		FontAwesomeIcon: true
	};

	it('Renders closed modal when no image', () => {
		const wrapper = mount(EditImage, {
			stubs
		});


		assert.isFalse(wrapper.find('.view-marker__image-img').exists());
		assert.isTrue(wrapper.find('.modal').exists());
		assert.isFalse(wrapper.vm.$data.modal);
	});


	it('Opens modal when has image', async () => {

		const image =  new UploadFile('name', 'image');
		const wrapper = mount(EditImage, {
			stubs
		});

		wrapper.setProps({
			image
		});
		await wrapper.vm.$nextTick();

		assert.isTrue(wrapper.vm.$data.modal);
		assert.isTrue(wrapper.find('.view-marker__image-img').exists());
		assert.equal(wrapper.find('.view-marker__image-img').attributes().src, image.preview);
	});

	it('Emits close on modal close', async () => {

		const wrapper = mount(EditImage, {
			propsData: {
				image:  new UploadFile('name', 'image')
			},
			stubs
		});

		wrapper.find(BaseModal).vm.$emit('close');

		const emittedEvent = wrapper.emitted().close[0];
		assert.deepEqual(Object.values(emittedEvent),[]) ;
	});

	it('Closes modal when props image removed', async () => {

		const wrapper = mount(EditImage, {
			stubs
		});

		wrapper.setProps({
			image: new UploadFile('name', 'image')
		});
		wrapper.setData({
			rotation: 90,
			preview: 'bla'
		});
		await wrapper.vm.$nextTick();


		wrapper.setProps({image: null})

		assert.isFalse(wrapper.find('.view-marker__image-img').exists());
		assert.isTrue(wrapper.find('.modal').exists());
		assert.isFalse(wrapper.vm.$data.modal);
		assert.isNull(wrapper.vm.$data.preview);
		assert.equal(wrapper.vm.$data.rotation,0);

	});

	it('Emits delete marker when delete clicked', async () => {

		const wrapper = mount(EditImage, {
			stubs
		});

		wrapper.setProps({
			image: new UploadFile('name', 'image')
		});
		await wrapper.vm.$nextTick();

		wrapper.find('.button.is-danger-background').trigger('click');

		const emittedEvent = wrapper.emitted().delete[0];
		assert.deepEqual(Object.values(emittedEvent),[]) ;

	});

	it('Emits save marker when save clicked', async () => {

		const wrapper = mount(EditImage, {
			stubs
		});

		wrapper.setProps({
			image: new UploadFile('name', 'image')
		});
		await wrapper.vm.$nextTick();

		wrapper.setData({
			rotation: 90
		})

		wrapper.find('.button.is-primary-background').trigger('click');

		const emittedEvent = wrapper.emitted().save[0];
		assert.deepEqual(Object.values(emittedEvent),[{rotation: 90}]) ;

	});

	it('Rotates image when rotate clicked', async () => {

		const rotateStub = sinon.stub(ImageService,'rotate').returns('rotatedImage');

		const wrapper = mount(EditImage, {
			stubs
		});


		wrapper.setProps({
			image: new UploadFile('name', 'image')
		});
		await wrapper.vm.$nextTick();

		wrapper.find('.button.is-selected-background').trigger('click');

		await wrapper.vm.$nextTick();

		assert.equal(wrapper.vm.$data.rotation, 90);
		assert.equal(wrapper.find('.view-marker__image-img').attributes().src, 'data:image/jpeg;base64,' + btoa('rotatedImage'));
		assert.isTrue(rotateStub.calledOnce);
		assert.isTrue(rotateStub.calledWith('image',90));

		sinon.restore();
	});

});
