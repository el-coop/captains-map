import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import { shallowMount } from '@vue/test-utils';
import BaseModal from '@/Components/Utilities/BaseModal.vue';
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

	let props;

	beforeEach(() => {
		global.window.addEventListener = sinon.stub();
		global.window.removeEventListener = sinon.stub();

		props = {
			routeName: 'modal',
		};
	});

	afterEach(() => {
		delete global.window.addEventListener;
		delete global.window.removeEventListener;
		sinon.restore();
	});

	it('Registers and destroys window pop state event', () => {

		const wrapper = shallowMount(BaseModal, {
			props,
			global: {
				stubs
			}
		});

		expect(global.window.addEventListener.calledOnce).toBeTruthy();
		expect(global.window.addEventListener.calledWith('popstate')).toBeTruthy();

		wrapper.unmount();

		expect(global.window.removeEventListener.calledOnce).toBeTruthy();
		expect(global.window.removeEventListener.calledWith('popstate')).toBeTruthy();


	});


	it('Renders hidden when not active', () => {
		const wrapper = shallowMount(BaseModal, {
			props,
			global: {
				stubs
			}
		});

		expect(wrapper.find('.modal').exists()).toBeTruthy();
		expect(wrapper.find('.modal-content').exists()).toBeFalsy();
	});

	it('Renders shown when active', () => {
		props.active = true;

		const wrapper = shallowMount(BaseModal, {
			props,
			global: {
				stubs,
				mocks
			},

		});

		expect(wrapper.find('.modal').exists()).toBeTruthy();
		expect(wrapper.find('.modal__content').exists()).toBeTruthy();
	});

	it('Emits close when closes', async () => {
		props.active = true;

		const wrapper = shallowMount(BaseModal, {
			props,
			global: {
				stubs,
				mocks
			},

		});

		await wrapper.setProps({
			active: false
		});


		expect(wrapper.emitted().close.length).toBe(1);
	});


	it('It changes route to given route name', async () => {
		const wrapper = shallowMount(BaseModal, {
			props,
			global: {
				stubs,
				mocks
			},
		});

		await wrapper.setProps({
			active: true
		});

		expect(mocks.$router.pushRoute.calledOnce).toBeTruthy();
		expect(mocks.$router.pushRoute.calledWith('modal')).toBeTruthy();
	});

	it('goes back when modal closes and emits events', () => {
		props.active = true;
		const wrapper = shallowMount(BaseModal, {
			global: {
				stubs,
				mocks,
			},
			props
		});

		wrapper.vm.close();

		expect(mocks.$router.back.calledOnce).toBeTruthy();
		expect(wrapper.emitted()['update:active'][0][0]).toBeFalsy();
	});

	it('goes back when back is pressed and emits events', () => {
		props.active = true;
		const wrapper = shallowMount(BaseModal, {
			global: {
				stubs
			},
			mocks,
			props
		});

		wrapper.vm.hideOnBack();

		expect(wrapper.emitted()['update:active'][0][0]).toBeFalsy();
	});
});
