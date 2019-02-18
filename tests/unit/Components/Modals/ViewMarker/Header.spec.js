import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Header from '@/Components/Modals/ViewMarker/Header';
import globe from '@/assets/images/globe-icon.png';

describe('ViewMarker/Header.vue', () => {
	let marker;

	beforeEach(() => {
		marker = {
			id: 1,
			user_id: 1,
			user: {
				username: 'test',
				bio: {
					path: '/path'
				}
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

	it('Shows user profile picture when supplied', () => {
		const wrapper = shallowMount(Header, {
			propsData: {
				marker
			}
		});

		assert.equal(wrapper.find('img.is-rounded').element.src, 'http://localhost/api/path');
	});

	it('Shows globe when no profile picture exists', () => {
		marker.user.bio.path = null;
		const wrapper = shallowMount(Header, {
			propsData: {
				marker
			}
		});

		assert.equal(wrapper.find('img.is-rounded').element.src, `http://localhost${globe}`);
	});


	it('Emits event when user clicks profile link', () => {
		const wrapper = shallowMount(Header, {
			propsData: {
				marker
			}
		});

		wrapper.find('a').trigger('click');
		assert.isOk(wrapper.emitted()['view-user-page']);
	});
});
