import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import LoggedOutBar from '@/Components/Dashboard/TopBar/LoggedOutBar';
import sinon from 'sinon';

describe('LoggedOutBar.vue', () => {

	const stubs = {
		'font-awesome-icon': true
	};

	afterEach(() => {
		sinon.restore();
	});

	it('Renders login and register', () => {
		const wrapper = shallowMount(LoggedOutBar, {
			stubs
		});

		assert.isTrue(wrapper.find('top-bar-stub').exists());
		assert.isTrue(wrapper.find('login-modal-stub').exists());
		assert.isTrue(wrapper.find('register-modal-stub').exists());
		assert.equal(wrapper.findAll('button.is-light.is-outlined').at(0).text(), 'Log In');
		assert.equal(wrapper.findAll('button.is-light.is-outlined').at(1).text(), 'Register');
	});

	it('Calls login modal when log in clicked', () => {
		const $modal = {
			show: sinon.spy()
		};
		const wrapper = shallowMount(LoggedOutBar, {
			stubs,
			mocks: {
				$modal
			}
		});

		wrapper.findAll('.button.is-light.is-outlined').at(0).trigger('click');

		assert.isTrue($modal.show.calledOnce);
		assert.isTrue($modal.show.calledWith('login'));

	});

	it('Calls register modal when register in clicked', () => {
		const $modal = {
			show: sinon.spy()
		};
		const wrapper = shallowMount(LoggedOutBar, {
			stubs,
			mocks: {
				$modal
			}
		});

		wrapper.findAll('.button.is-light.is-outlined').at(1).trigger('click');

		assert.isTrue($modal.show.calledOnce);
		assert.isTrue($modal.show.calledWith('register'));

	});
});