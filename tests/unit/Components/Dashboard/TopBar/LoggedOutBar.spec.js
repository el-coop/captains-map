import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import LoggedOutBar from '@/Components/Dashboard/TopBar/LoggedOutBar';
import sinon from 'sinon';

describe('LoggdOutBar.vue', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('Renders login and register', () => {
		const wrapper = shallowMount(LoggedOutBar);


		assert.isTrue(wrapper.find('loginmodal-stub').exists());
		assert.isTrue(wrapper.find('registermodal-stub').exists());
		assert.include(wrapper.html(), 'Log in');
		assert.include(wrapper.html(), 'Register');
	});

	it('Calls login modal when log in clicked', () => {
		const $modal = {
			show: sinon.spy()
		};
		const wrapper = shallowMount(LoggedOutBar, {
			mocks: {
				$modal
			}
		});

		const loginButton = wrapper.findAll('.button.is-dark.is-fullwidth').at(0);
		loginButton.trigger('click');

		assert.isTrue($modal.show.calledOnce);
		assert.isTrue($modal.show.calledWith('login'));

	});

	it('Calls register modal when register in clicked', () => {
		const $modal = {
			show: sinon.spy()
		};
		const wrapper = shallowMount(LoggedOutBar, {
			mocks: {
				$modal
			}
		});

		const registerButton = wrapper.findAll('.button.is-dark.is-fullwidth').at(1);
		registerButton.trigger('click');

		assert.isTrue($modal.show.calledOnce);
		assert.isTrue($modal.show.calledWith('register'));

	});
});