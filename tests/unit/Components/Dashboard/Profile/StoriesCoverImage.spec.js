import {describe, it, expect, afterEach} from 'vitest';
import { mount } from '@vue/test-utils';
import StoryCoverImage from '@/Components/Dashboard/Profile/StoryCoverImage.vue';
import sinon from 'sinon';
import globe from '@/assets/images/globe-icon.png';

describe('Stories.vue', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('Renders with globe when cover is null', async () => {
		const props = {
			cover: null
		}
		const wrapper = mount(StoryCoverImage, {
			props
		});

		expect(wrapper.find('.story__figure').exists()).toBeTruthy();
		expect(wrapper.find('img').attributes('src')).toBe(globe);
	});

	it('Renders with instagram when cover is instagram', async () => {
		const props = {
			cover: {
				type: 'instagram',
				path: 'bla'
			}
		}
		const wrapper = mount(StoryCoverImage, {
			props
		});

		expect(wrapper.find('.story__figure').exists()).toBeTruthy();
		expect(wrapper.find('.image.is-32x32').exists()).toBeFalsy();
		expect(wrapper.find('img').attributes('src')).toBe(`https://instagram.com/p/bla/media/`);
	});

	it('Renders with image when cover is image', async () => {
		const props = {
			cover: {
				type: 'image',
				path: '/bla'
			}
		}
		const wrapper = mount(StoryCoverImage, {
			props
		});

		expect(wrapper.find('.story__figure').exists()).toBeTruthy();
		expect(wrapper.find('img').attributes('src')).toBe(`/api/bla`);
	});

	it.only('Renders as small', async () => {
		const props = {
			cover: {
				type: 'instagram',
				path: 'bla'
			},
			isSmall: true
		}
		const wrapper = mount(StoryCoverImage, {
			props
		});

		expect(wrapper.find('.story__figure.image.is-32x32').exists()).toBeTruthy();
		expect(wrapper.find('img').attributes('src')).toBe(`https://instagram.com/p/bla/media/`);
	});
});
