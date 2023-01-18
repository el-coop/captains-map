import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import {shallowMount} from '@vue/test-utils';
import MarkerEntry from '@/Components/Dashboard/SideBar/MarkerEntry.vue';
import sinon from 'sinon';
import map from '@/Services/LeafletMapService';

describe('MarkerEntry.vue', () => {
	let marker;
	let stubs = {
		FontAwesomeIcon: true
	}


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
			global: {
				stubs
			},
			props: {
				marker
			}
		});

		await wrapper.vm.$nextTick();

		expect(wrapper.find('.marker-entry__card-image').exists()).toBeTruthy();
		expect(wrapper.find('.marker-entry__card-content').text()).toBe('Z0ZX6tdEBGAZYYCJT1NPZ0ZX6tdEBGAZYYCJT1NPZ0...');
		expect(wrapper.find('.marker-entry__card-profile-img').attributes().src).toBe('/api/wrath');

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
			props: {
				marker
			},
			global: {
				stubs
			}
		});

		expect(wrapper.find('font-awesome-icon-stub').exists()).toBeTruthy();

	});

	it('Calculates image src for image type', () => {
		const wrapper = shallowMount(MarkerEntry, {
			global: {
				stubs
			},
			props: {
				marker
			}

		});

		expect(wrapper.vm.$data.src).toBe(`/api${marker.media[0].path.replace('images', 'thumbnails')}`);
	});

	it('Calculates image src for instagram type', () => {
		marker.media[0].type = 'instagram';

		const wrapper = shallowMount(MarkerEntry, {
			global: {
				stubs
			},
			props: {
				marker
			}

		});

		expect(wrapper.vm.$data.src).toBe(`https://instagram.com/p/${marker.media[0].path}/media/`);
	});

	it('Reacts to click', () => {
		const $bus = {
			$emit: sinon.spy()
		};
		const mapMoveStub = sinon.stub(map, 'move');
		const wrapper = shallowMount(MarkerEntry, {
			global: {
				stubs
			},
			props: {
				marker
			}

		});

		wrapper.find('.marker-entry__card').trigger('click');

		expect(mapMoveStub.calledOnce).toBeTruthy();
		expect(mapMoveStub.calledWith([1, 1], 16)).toBeTruthy();

	});
});
