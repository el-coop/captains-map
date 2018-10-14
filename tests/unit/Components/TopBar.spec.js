import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import TopBar from '@/Components/view/TopBar';
import Auth from '@/Services/authentication.service';
import sinon from 'sinon';

describe('TopBar.vue', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('Renders login and register when not logged in', () => {
		const wrapper = shallowMount(TopBar);

		assert.include(wrapper.html(), 'Log in');
		assert.include(wrapper.html(), 'Register');
	});


	it('Renders dashboard and logout when not logged in', () => {
		sinon.stub(Auth, 'isLoggedIn').callsFake(() => {
			return true;
		});
		const wrapper = shallowMount(TopBar);

		assert.include(wrapper.html(), 'Dashboard');
		assert.include(wrapper.html(), '</logout-stub>');
	});

	it('Calls login modal when log in clicked', () => {
		const $modal = {
			show: sinon.spy()
		};
		const wrapper = shallowMount(TopBar, {
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
		const wrapper = shallowMount(TopBar, {
			mocks: {
				$modal
			}
		});

		const registerButton = wrapper.findAll('.button.is-dark.is-fullwidth').at(1);
		registerButton.trigger('click');

		assert.isTrue($modal.show.calledOnce);
		assert.isTrue($modal.show.calledWith('register'));

	});

	it('Changes route when dashboard clicked', () => {
		sinon.stub(Auth, 'isLoggedIn').callsFake(() => {
			return true;
		});
		const $router = {
			push: sinon.spy()
		};
		const wrapper = shallowMount(TopBar, {
			mocks: {
				$router
			}
		});

		const dashboardButton = wrapper.findAll('.button.is-dark.is-fullwidth').at(0);
		dashboardButton.trigger('click');

		assert.isTrue($router.push.calledOnce);
		assert.isTrue($router.push.calledWith('/edit'));
	});

});