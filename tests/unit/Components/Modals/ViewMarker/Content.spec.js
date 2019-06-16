import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Content from '@/Components/Modals/ViewMarker/Content';
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
			propsData: {
				marker
			},
			mocks,
			stubs
		});

		assert.isTrue(wrapper.find('.media-right').exists());
		assert.isTrue(wrapper.find('.media-content').exists());
	});


	it('Copies links', async () => {
		const wrapper = shallowMount(Content, {
			propsData: {
				marker
			},
			mocks,
			stubs
		});

		wrapper.find('button').trigger('click');

		await wrapper.vm.$nextTick();

		assert.isTrue(global.navigator.clipboard.writeText.calledOnce);
		assert.isTrue(global.navigator.clipboard.writeText.calledWith(`${window.location.protocol}//${window.location.host}href`));
		assert.isTrue(mocks.$toast.info.calledOnce);
		assert.isTrue(mocks.$toast.info.calledWith('You can paste it anywhere', 'Link copied'));
	});


	it('Shares to facebook when navigator.share is not available and prints 2 buttons', async () => {
		const wrapper = shallowMount(Content, {
			propsData: {
				marker
			},
			mocks,
			stubs
		});

		wrapper.findAll('button').at(1).trigger('click');

		await wrapper.vm.$nextTick();

		assert.equal(2,wrapper.findAll('button').length);
		assert.isTrue(global.window.open.calledOnce);
		assert.isTrue(global.window.open.calledWith(`https://www.facebook.com/sharer/sharer.php?u=${window.location.protocol}//${window.location.host}href`));
	});

	it('Shares when navigator.share is available and shows only one button', async () => {
		global.navigator.share = sinon.stub();
		const wrapper = shallowMount(Content, {
			propsData: {
				marker
			},
			mocks,
			stubs
		});

		wrapper.find('button').trigger('click');

		await wrapper.vm.$nextTick();

		assert.equal(1,wrapper.findAll('button').length);
		assert.isTrue(global.window.open.notCalled);
		assert.isTrue(global.navigator.share.calledOnce);
		assert.isTrue(global.navigator.share.calledWith({
			title: '',
			text: '',
			url: `${window.location.protocol}//${window.location.host}href`,
		}));
	});
});
