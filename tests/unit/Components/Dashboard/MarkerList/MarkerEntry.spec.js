import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import MarkerEntry from '@/Components/Dashboard/SideBar/MarkerEntry';
import sinon from 'sinon';
import map from '@/Services/LeafletMapService';

describe('MarkerList.vue', () => {
	let marker;

	beforeEach(() => {
		marker = {
			media: {
				type: 'image',
				path: '/images/testPath'
			},
			description: 'Z0ZX6tdEBGAZYYCJT1NPZ0ZX6tdEBGAZYYCJT1NPZ0ZX6tdEBGAZYYCJT1NP',
			lat: 1,
			lng: 1,

		};
	});


	afterEach(() => {
		sinon.restore();
	});

	it('Renders', () => {
		const wrapper = shallowMount(MarkerEntry, {
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
		const wrapper = shallowMount(MarkerEntry, {
			propsData: {
				marker
			}
		});

		assert.equal(wrapper.vm.$data.src, `/api${marker.media.path.replace('images', 'thumbnails')}`);
	});

	it('Calculates image src for instagram type', () => {
		marker.media.type = 'instagram';

		const wrapper = shallowMount(MarkerEntry, {
			propsData: {
				marker
			}
		});

		assert.equal(wrapper.vm.$data.src, `https://instagram.com/p/${marker.media.path}/media/`);
	});

	it('Reacts to click', () => {
		const $bus = {
			$emit: sinon.spy()
		};
		const mapMoveStub = sinon.stub(map, 'move');
		const wrapper = shallowMount(MarkerEntry, {
			propsData: {
				marker
			},
			mocks: {
				$bus
			}
		});

		wrapper.find('.media').trigger('click');

		assert.isTrue($bus.$emit.calledOnce);
		assert.isTrue($bus.$emit.calledWith('moving-map'));
		assert.isTrue(mapMoveStub.calledOnce);
		assert.isTrue(mapMoveStub.calledWith([1, 1], 16));

	});
});