import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import LoggedOutBar from '@/Components/Dashboard/TopBar/LoggedOutBar';
import sinon from 'sinon';

describe('LoggedOutBar.vue', () => {

	const stubs = {
		FontAwesomeIcon: true,
		LoginModal: true,
		RegisterModal: true,
	};
	let mocks;


	beforeEach(() => {
		mocks = {
			$store: {
				state: {
					Markers: {
						username: false
					},
				},
				getters: {
					'Uploads/allFiles': []
				}
			}
		};
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Renders login and register', () => {
		const wrapper = mount(LoggedOutBar, {
			stubs,
			mocks
		});

		assert.isTrue(wrapper.find('.top-bar').exists());
		assert.isTrue(wrapper.find('loginmodal-stub').exists());
		assert.isTrue(wrapper.find('registermodal-stub').exists());
		assert.equal(wrapper.findAll('button.is-light.is-outlined').at(0).text(), 'Log In');
		assert.equal(wrapper.findAll('button.is-light.is-outlined').at(1).text(), 'Register');
	});

	it('Starts login modal when log in clicked', () => {
		const wrapper = mount(LoggedOutBar, {
			stubs,
			mocks
		});

		wrapper.setData({
			loginModal: false
		});

		wrapper.findAll('.button.is-light.is-outlined').at(0).trigger('click');

		assert.isTrue(wrapper.vm.$data.loginModal);

	});

	it('Calls register modal when register in clicked', () => {
		const wrapper = mount(LoggedOutBar, {
			stubs,
			mocks
		});

		wrapper.setData({
			registerModal: false
		});

		wrapper.findAll('.button.is-light.is-outlined').at(1).trigger('click');

		assert.isTrue(wrapper.vm.$data.registerModal);

	});
});
