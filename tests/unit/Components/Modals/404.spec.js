import { assert } from 'chai';
import { shallowMount, mount } from '@vue/test-utils';
import NotFound from '@/Components/Modals/404.vue';
import sinon from 'sinon';

describe('404.vue', () => {

	const stubs = {
		VModal: true,
		FontAwesomeIcon: true
	};

	it('renders', () => {
		const wrapper = mount(NotFound, {
			mocks: {
				$router: {
					currentRoute: {
						fullPath: 'path'
					}
				}
			},
			stubs
		});

		assert.isTrue(wrapper.find('img.four04-wrapper__image').exists());
		assert.isTrue(wrapper.find('img.four04-wrapper__cover').exists());
		assert.isTrue(wrapper.find('vmodal-stub').exists());
	});

	it('It changes navigates when closed', async () => {
		const $router = {
			push: sinon.stub()
		};

		const wrapper = shallowMount(NotFound, {
			stubs,
			mocks: {
				$router
			}
		});

		wrapper.vm.$children[0].$emit('before-close');

		assert.isTrue($router.push.calledWith('/'));
	});

});
