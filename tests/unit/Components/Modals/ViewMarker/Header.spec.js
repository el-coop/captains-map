import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Header from '@/Components/Modals/ViewMarker/Header';

describe('ViewMarker/Header.vue', () => {
	let marker;

	beforeEach(() => {
		marker = {
			id: 1,
			user_id: 1,
			user: {
				username: 'test',
			},
			media: {
				type: 'image',
				path: 'test',
				id: 1
			}
		};
	});

	it('Renders', () => {
		const wrapper = shallowMount(Header, {
			propsData: {
				marker
			}
		});

		assert.isTrue(wrapper.find('.media-left').exists());
		assert.isTrue(wrapper.find('.media-content').exists());
	});


	it('Formats date properly', () => {
		marker.time = new Date(Date.UTC(2018, 11, 24, 10, 33, 30, 0));
		const wrapper = shallowMount(Header, {
			propsData: {
				marker
			}
		});

		assert.equal(wrapper.vm.dateDisplay, '24/12/2018 10:33');
	});


	it('Formats date properly when hour is under 10', () => {
		marker.time = new Date(Date.UTC(2018, 11, 24, 5, 33, 30, 0));
		const wrapper = shallowMount(Header, {
			propsData: {
				marker
			}
		});

		assert.equal(wrapper.vm.dateDisplay, '24/12/2018 05:33');
	});
});
