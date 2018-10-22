import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import SlideUpModal from '@/Components/Utilities/SlideUpModal';
import sinon from 'sinon';

describe('SlidaUpModal.vue', () => {

	it('Renders', () => {
		const wrapper = shallowMount(SlideUpModal, {
			propsData: {
				name: 'modal'
			},
			stubs: {
				modal: true,
				'font-awesome-icon': true
			}
		});

		assert.isTrue(wrapper.find('modal-stub').exists());
	});

	it('It changes route', () => {
		const pushRoute = sinon.spy();
		const wrapper = shallowMount(SlideUpModal, {
			propsData: {
				name: 'modal'
			},
			stubs: {
				modal: true,
				'font-awesome-icon': true
			},
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
			stubs: {
				modal: true,
				'font-awesome-icon': true
			},
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
});