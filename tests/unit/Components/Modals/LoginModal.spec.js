import {describe, it, expect, afterEach} from 'vitest';
import {mount} from '@vue/test-utils';
import LoginModal from '@/Components/Modals/LoginModal.vue';
import BaseModal from "@/Components/Utilities/BaseModal.vue"
import sinon from 'sinon';
import {createStore} from "vuex";

describe('LoginModal.vue', () => {
	const stubs = {
		FontAwesomeIcon: true
	};

	const props = {
		active: true
	};

	const mocks = {
		$router: {
			push: sinon.spy()
		}
	};

	const storeOptions = {
		modules: {
			User: {
				namespaced: true,
				actions: {
					login() {
					}
				}
			}
		},

	};

	afterEach(() => {
		sinon.restore();
	});

	it('renders modal when active', () => {
		const wrapper = mount(LoginModal, {
			global: {
				stubs
			},
			props,
		});

		expect(wrapper.find('.modal').exists()).toBeTruthy();
		expect(wrapper.html()).toContain('Login');
	});

	it('doesnt render modal when not active', () => {
		const wrapper = mount(LoginModal, {
			global: {
				stubs
			},
		});

		expect(wrapper.find('.modal').exists()).toBeTruthy();
		expect(wrapper.html()).not.toContain('Login');
	});

	it('closes modal on click', () => {
		const wrapper = mount(LoginModal, {
			global: {
				stubs
			},
			props,
		});

		wrapper.find('.card__footer-item a').trigger('click');

		expect(wrapper.emitted()['update:active'][0][0]).toBeFalsy();
	});

	it('closes modal when emitted form modal', () => {
		const wrapper = mount(LoginModal, {
			global: {
				stubs
			},
			props,
		});

		wrapper.findComponent(BaseModal).vm.$emit('update:active', false);

		expect(wrapper.emitted()['update:active'][0][0]).toBeFalsy();
	});

	it('Attempts logging in and shows errors', async () => {
		const loginStub = sinon.stub().returns(false);
		storeOptions.modules.User.actions.login = loginStub;
		const wrapper = mount(LoginModal, {
			global: {
				plugins: [createStore(storeOptions)],
				mocks,
				stubs
			},
			props
		});

		await wrapper.setData({
			form: {
				username: 'test',
				password: 'test'
			}
		});

		wrapper.find('button').trigger('click');

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(loginStub.calledOnce).toBeTruthy();
		expect(loginStub.calledWith(sinon.match.any, {
			username: 'test',
			password: 'test'
		})).toBeTruthy();

		expect(wrapper.find('.help.is-danger').exists()).toBeTruthy();

	});


	it('Attempts logging in and changes route on success', async () => {
		const loginStub = sinon.stub().returns(true);
		storeOptions.modules.User.actions.login = loginStub;
		const wrapper = mount(LoginModal, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks,
			},
			props
		});

		await wrapper.setData({
			form: {
				username: 'test',
				password: 'test'
			}
		});

		wrapper.find('button').trigger('click');
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5);
		});

		expect(loginStub.calledOnce).toBeTruthy();
		expect(loginStub.calledWith(sinon.match.any, {
			username: 'test',
			password: 'test'
		})).toBeTruthy();

		expect(mocks.$router.push.calledOnce).toBeTruthy();
		expect(mocks.$router.push.calledWith('/edit')).toBeTruthy();

	});
});
