import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import MarkerEntry from '@/Components/Dashboard/SideBar/MarkerEntry';
import sinon from 'sinon';
import map from '@/Services/LeafletMapService';

describe('MarkerEntry.vue', () => {
	let marker;

	beforeEach(() => {
		global.window.matchMedia = sinon.stub().returns({
			matches: false
		});

		marker = {
			media: [{
				type: 'image',
				path: '/images/testPath'
			}],
			description: 'Z0ZX6tdEBGAZYYCJT1NPZ0ZX6tdEBGAZYYCJT1NPZ0ZX6tdEBGAZYYCJT1NP',
			lat: 1,
			lng: 1,
			user: {
				username: 'test',
				bio: {
					path: '/wrath',
				}
			},
			time: '2018-10-06 15:43:57'

		};
	});


	afterEach(() => {
		sinon.restore();
		delete global.window.matchMedia;
	});

	it('Renders', async () => {
		const wrapper = shallowMount(MarkerEntry, {
			propsData: {
				marker
			}
		});

		await wrapper.vm.$nextTick();

		assert.isTrue(wrapper.find('.marker-entry__card-image').exists());
		assert.equal(wrapper.find('.marker-entry__card-content').text(), 'Z0ZX6tdEBGAZYYCJT1NPZ0ZX6tdEBGAZYYCJT1NPZ0...');
		assert.equal(wrapper.find('.marker-entry__card-profile-img').attributes().src, '/api/wrath');

	});

	it('Shows album icon when more than one image', () => {
		marker.media = [{
			type: 'image',
			path: '/images/testPath'
		}, {
			type: 'image',
			path: '/images/testPath'
		}];
		const wrapper = shallowMount(MarkerEntry, {
			propsData: {
				marker
			},
			stubs: {
				FontAwesomeIcon: true
			}
		});

		assert.isTrue(wrapper.find('fontawesomeicon-stub').exists());

	});

	it('Calculates image src for image type', () => {
		const wrapper = shallowMount(MarkerEntry, {
			propsData: {
				marker
			}
		});

		assert.equal(wrapper.vm.$data.src, `/api${marker.media[0].path.replace('images', 'thumbnails')}`);
	});

	it('Calculates image src for instagram type', () => {
		marker.media[0].type = 'instagram';

		const wrapper = shallowMount(MarkerEntry, {
			propsData: {
				marker
			}
		});

		assert.equal(wrapper.vm.$data.src, `https://instagram.com/p/${marker.media[0].path}/media/`);
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

		wrapper.find('.marker-entry__card').trigger('click');

		assert.isTrue(mapMoveStub.calledOnce);
		assert.isTrue(mapMoveStub.calledWith([1, 1], 16));

	});
});
