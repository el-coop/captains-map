import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import LoggedInBar from '@/Components/Dashboard/TopBar/LoggedInBar';
import sinon from 'sinon';

describe('LoggedInBar.vue', () => {

	afterEach(() => {
		sinon.restore();
	});


	it('Renders with dashboard button in map feed', () => {
		const wrapper = shallowMount(LoggedInBar, {
			mocks: {
				$router: {
					currentRoute: {
						name: 'view'
					}
				}
			}
		});

		assert.include(wrapper.html(), 'Dashboard');
		assert.isTrue(wrapper.find('logout-stub').exists());
		assert.isTrue(wrapper.find('searchbar-stub').exists());
	});

	it('Changes route when dashboard clicked', () => {
		const $router = {
			push: sinon.spy(),
			currentRoute: {
				name: 'view'
			}
		};
		const wrapper = shallowMount(LoggedInBar, {
			mocks: {
				$router
			}
		});

		wrapper.find('.button.is-dark.is-fullwidth').trigger('click');

		assert.isTrue($router.push.calledOnce);
		assert.isTrue($router.push.calledWith('/edit'));
	});

	it('Renders with map feed button in dashboard', () => {
		const wrapper = shallowMount(LoggedInBar, {
			mocks: {
				$router: {
					currentRoute: {
						name: 'edit'
					}
				}
			}
		});

		assert.include(wrapper.html(), 'Map Feed');
		assert.isTrue(wrapper.find('logout-stub').exists());
		assert.isTrue(wrapper.find('searchbar-stub').exists());
	});

	it('Changes route when Map Feed clicked', () => {
		const $router = {
			push: sinon.spy(),
			currentRoute: {
				name: 'edit'
			}
		};
		const wrapper = shallowMount(LoggedInBar, {
			mocks: {
				$router
			}
		});

		wrapper.find('.button.is-dark.is-fullwidth').trigger('click');

		assert.isTrue($router.push.calledOnce);
		assert.isTrue($router.push.calledWith('/'));
	});

});