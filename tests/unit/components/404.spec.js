import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import NotFound from '@/components/global/404.vue';
import sinon from 'sinon';

describe('404.vue', () => {
	it('renders', () => {
		const wrapper = mount(NotFound, {
			stubs: {
				'font-awesome-icon': true,
				'modal': true
			},
			mocks: {
				$router: {
					currentRoute: {
						fullPath: 'path'
					}
				}
			}
		});

		assert.isTrue(wrapper.find('img.atlantis').exists());
		assert.isTrue(wrapper.find('img.tear').exists());
		assert.isTrue(wrapper.find('modal-stub').exists());
	});

	it('Saves starting route when opened', async () => {
		const wrapper = mount(NotFound, {
			stubs: {
				'font-awesome-icon': true,
				'modal': true
			},
			mocks: {
				$router: {
					currentRoute: {
						fullPath: 'path'
					}
				}
			}
		});

		wrapper.vm.$children[0].$emit('before-open');
		assert.equal(wrapper.vm.$data.openRoute, 'path');

	});

	it('It changes navigates when closed on the same route as opened', async () => {
		const $router = {
			currentRoute: {
				fullPath: 'path'
			},
			push(push) {

			}
		};
		const routerStub = sinon.stub($router, 'push');
		const wrapper = mount(NotFound, {
			stubs: {
				'font-awesome-icon': true,
				'modal': true
			},
			mocks: {
				$router
			}
		});

		wrapper.vm.$children[0].$emit('before-open');
		wrapper.vm.$children[0].$emit('before-close');

		assert.isTrue(routerStub.calledWith('/'));
	});


	it('It doesnt changes navigation when closed on a route different from opened', () => {
		const $router = {
			currentRoute: {
				fullPath: 'path'
			},
			push(push) {

			}
		};
		const routerStub = sinon.stub($router, 'push');
		const wrapper = mount(NotFound, {
			stubs: {
				'font-awesome-icon': true,
				'modal': true
			},
			mocks: {
				$router
			}
		});

		wrapper.vm.$children[0].$emit('before-open');
		$router.currentRoute.fullPath = 'test';
		wrapper.vm.$children[0].$emit('before-close');

		assert.isFalse(routerStub.calledWith('/'));
	});
});
