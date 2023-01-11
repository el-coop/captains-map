import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import { shallowMount } from '@vue/test-utils';
import Content from '@/Components/Modals/ViewMarker/Content.vue';
import sinon from 'sinon';

describe('ViewMarker/Content.vue', () => {
	let marker;
	let mocks;
	const stubs = {
		FontAwesomeIcon: true
	};

	beforeEach(() => {
		global.navigator.share = false;
		global.navigator.clipboard ={
			writeText: sinon.stub()
		};
		global.window.open = sinon.stub();

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

		mocks = {
			$router: {
				resolve: sinon.stub().returns({
					href: 'href'
				})
			},
			$toast: {
				info: sinon.spy()
			}
		}
	});

	afterEach(() => {
		sinon.restore();
		delete global.navigator.share;
		delete global.window.open;
		delete global.navigator.clipboard;
	});

	it('Renders', () => {
		const wrapper = shallowMount(Content, {
			props: {
				marker
			},
			global: {
				mocks,
				stubs
			}
		});

		expect(wrapper.find('.view-marker__content-text').exists()).toBeTruthy();
		expect(wrapper.find('.view-marker__content-buttons').exists()).toBeTruthy();
	});


	it('Copies links', async () => {
		const wrapper = shallowMount(Content, {
			props: {
				marker
			},
			global: {
				mocks,
				stubs
			}
		});

		wrapper.find('button').trigger('click');

		await wrapper.vm.$nextTick();

		expect(global.navigator.clipboard.writeText.calledOnce).toBeTruthy();
		expect(global.navigator.clipboard.writeText.calledWith(`${window.location.protocol}//${window.location.host}href`)).toBeTruthy();
		expect(mocks.$toast.info.calledOnce).toBeTruthy();
		expect(mocks.$toast.info.calledWith('You can paste it anywhere', 'Link copied')).toBeTruthy();
	});


	it('Shares to facebook when navigator.share is not available and prints 2 buttons', async () => {
		const wrapper = shallowMount(Content, {
			props: {
				marker
			},
			global: {
				mocks,
				stubs
			}
		});

		wrapper.findAll('button').at(1).trigger('click');

		await wrapper.vm.$nextTick();

		expect(wrapper.findAll('button').length).toBe(2);
		expect(global.window.open.calledOnce).toBeTruthy();
		expect(global.window.open.calledWith(`https://www.facebook.com/sharer/sharer.php?u=${window.location.protocol}//${window.location.host}href`)).toBeTruthy();
	});

	it('Shares when navigator.share is available and shows only one button', async () => {
		global.navigator.share = sinon.stub();
		const wrapper = shallowMount(Content, {
			props: {
				marker
			},
			global: {
				mocks,
				stubs
			}
		});

		wrapper.find('button').trigger('click');

		await wrapper.vm.$nextTick();

		expect(wrapper.findAll('button').length).toBe(1);
		expect(global.window.open.notCalled).toBeTruthy();
		expect(global.navigator.share.calledOnce).toBeTruthy();
		expect(global.navigator.share.calledWith({
			title: '',
			text: '',
			url: `${window.location.protocol}//${window.location.host}href`,
		})).toBeTruthy();
	});
});
