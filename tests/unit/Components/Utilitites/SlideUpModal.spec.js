import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import SlideUpModal from '@/Components/Utilities/BaseModal';
import sinon from 'sinon';

describe('SlidaUpModal.vue', () => {

	const stubs = {
		VModal: true,
		FontAwesomeIcon: true
	};

	it('Renders', () => {
		const wrapper = shallowMount(SlideUpModal, {
			propsData: {
				name: 'modal'
			},
			stubs
		});

		assert.isTrue(wrapper.find('vmodal-stub').exists());
	});

	it('It changes route', () => {
		const pushRoute = sinon.spy();
		const wrapper = shallowMount(SlideUpModal, {
			propsData: {
				name: 'modal'
			},
			stubs,
			mocks: {
				$router: {
					pushRoute
				}
			}
		});

		wrapper.vm.opened();

		assert.isTrue(pushRoute.calledOnce);
		assert.isTrue(pushRoute.calledWith('modal'));
	});

	it('It changes route to given route name', () => {
		const pushRoute = sinon.spy();
		const wrapper = shallowMount(SlideUpModal, {
			propsData: {
				name: 'modal',
				routeName: 'modal1'
			},
			stubs,
			mocks: {
				$router: {
					pushRoute
				}
			}
		});

		wrapper.vm.opened();

		assert.isTrue(pushRoute.calledOnce);
		assert.isTrue(pushRoute.calledWith('modal1'));
	});

	it('goes back when modal closes', () => {
		const back = sinon.spy();
		const wrapper = shallowMount(SlideUpModal, {
			propsData: {
				name: 'modal',
				routeName: 'modal1'
			},
			stubs,
			mocks: {
				$router: {
					back
				}
			}
		});

		wrapper.setData({
			isOpen: true
		});

		wrapper.vm.beforeClose();

		assert.isTrue(back.calledOnce);
	});
});
