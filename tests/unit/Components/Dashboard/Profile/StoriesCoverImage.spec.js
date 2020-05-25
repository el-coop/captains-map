import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import StoryCoverImage from '@/Components/Dashboard/Profile/StoryCoverImage';
import sinon from 'sinon';
import globe from '@/assets/images/globe-icon.png';

describe('Stories.vue', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('Renders with globe when cover is null', async () => {
		const propsData = {
			cover: null
		}
		const wrapper = mount(StoryCoverImage, {
			propsData
		});

		assert.isTrue(wrapper.find('.story__figure').exists());
		assert.equal(wrapper.find('img').attributes('src'), globe);
	});

	it('Renders with instagram when cover is instagram', async () => {
		const propsData = {
			cover: {
				type: 'instagram',
				path: 'bla'
			}
		}
		const wrapper = mount(StoryCoverImage, {
			propsData
		});

		assert.isTrue(wrapper.find('.story__figure').exists());
		assert.isFalse(wrapper.find('.image.is-32x32').exists());
		assert.equal(wrapper.find('img').attributes('src'), `https://instagram.com/p/bla/media/`);
	});

	it('Renders with image when cover is image', async () => {
		const propsData = {
			cover: {
				type: 'image',
				path: '/bla'
			}
		}
		const wrapper = mount(StoryCoverImage, {
			propsData
		});

		assert.isTrue(wrapper.find('.story__figure').exists());
		assert.equal(wrapper.find('img').attributes('src'), `/api/bla`);
	});

	it('Renders as small', async () => {
		const propsData = {
			cover: {
				type: 'instagram',
				path: 'bla'
			},
			isSmall: true
		}
		const wrapper = mount(StoryCoverImage, {
			propsData
		});

		assert.isTrue(wrapper.find('.story__figure.image.is-32x32').exists());
		assert.equal(wrapper.find('img').attributes('src'), `https://instagram.com/p/bla/media/`);
	});
});
