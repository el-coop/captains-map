import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import BaseModal from '@/Components/Utilities/BaseModal';
import sinon from 'sinon';

describe('BaseModal.vue', () => {

	const stubs = {
		FontAwesomeIcon: true
	};

	const mocks = {
		$router: {
			back: sinon.spy(),
			pushRoute: sinon.spy()
		}
	};

	let propsData;

	beforeEach(() => {
		propsData = {
			routeName: 'modal',
		};
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Registers and destroys window pop state event', () => {
		global.window.addEventListener = sinon.stub();
		global.window.removeEventListener = sinon.stub();

		const wrapper = shallowMount(BaseModal, {
			propsData,
			stubs
		});

		assert.isTrue(global.window.addEventListener.calledOnce);
		assert.isTrue(global.window.addEventListener.calledWith('popstate'));

		wrapper.destroy();

		assert.isTrue(global.window.removeEventListener.calledOnce);
		assert.isTrue(global.window.removeEventListener.calledWith('popstate'));

		delete global.window.addEventListener;
		delete global.window.removeEventListener;

	});


	it('Renders hidden when not active', () => {
		const wrapper = shallowMount(BaseModal, {
			propsData,
			stubs
		});

		assert.isTrue(wrapper.find('.modal').exists());
		assert.isFalse(wrapper.find('.modal-content').exists());
	});

	it('Renders shown when active', () => {
		propsData.active = true;

		const wrapper = shallowMount(BaseModal, {
			propsData,
			stubs,
			mocks
		});

		assert.isTrue(wrapper.find('.modal').exists());
		assert.isTrue(wrapper.find('.modal-content').exists());
	});

	it('Emits close when closes', () => {
		propsData.active = true;

		const wrapper = shallowMount(BaseModal, {
			propsData,
			stubs,
			mocks
		});

		wrapper.setProps({
			active: false
		});


		assert.equal(wrapper.emitted().close.length, 1);
	});


	it('It changes route to given route name', () => {
		const wrapper = shallowMount(BaseModal, {
			propsData,
			stubs,
			mocks
		});

		wrapper.setProps({
			active: true
		});

		assert.isTrue(mocks.$router.pushRoute.calledOnce);
		assert.isTrue(mocks.$router.pushRoute.calledWith('modal'));
	});

	it('goes back when modal closes and emits events', () => {
		propsData.active = true;
		const wrapper = shallowMount(BaseModal, {
			stubs,
			mocks,
			propsData
		});

		wrapper.vm.close();

		assert.isTrue(mocks.$router.back.calledOnce);
		assert.isFalse(wrapper.emitted()['update:active'][0][0]);
	});

	it('goes back when back is pressed and emits events', () => {
		propsData.active = true;
		const wrapper = shallowMount(BaseModal, {
			stubs,
			mocks,
			propsData
		});

		wrapper.vm.hideOnBack();

		assert.isTrue(mocks.$router.back.calledOnce);
		assert.isFalse(wrapper.emitted()['update:active'][0][0]);
	});
});
