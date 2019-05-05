import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import LoginModal from '@/Components/Modals/LoginModal';
import sinon from 'sinon';

describe('LoginModal.vue', () => {
	const stubs = {
		VModal: true,
		FontAwesomeIcon: true
	};

	afterEach(() => {
		sinon.restore();
	});

	it('renders', () => {
		const wrapper = mount(LoginModal, {
			stubs
		});

		assert.isTrue(wrapper.find('vmodal-stub').exists());
		assert.include(wrapper.html(), 'Login');
	});

	it('closes modal on click', () => {
		const mocks = {
			$modal: {
				hide: sinon.spy()
			}
		};
		const wrapper = mount(LoginModal, {
			stubs,
			mocks
		});

		wrapper.find('a').trigger('click');

		assert.isTrue(mocks.$modal.hide.calledOnce);
		assert.isTrue(mocks.$modal.hide.calledWith('login'));
	});

	it('Attempts logging in and shows errors', async () => {
		const mocks = {
			$store: {
				dispatch: sinon.stub().returns(false)
			}
		};
		const wrapper = mount(LoginModal, {
			stubs,
			mocks
		});

		wrapper.setData({
			form: {
				username: 'test',
				password: 'test'
			}
		});

		wrapper.find('button').trigger('click');

		await wrapper.vm.$nextTick();

		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('User/login', {
			username: 'test',
			password: 'test'
		}));
		assert.isTrue(wrapper.find('.help.is-danger').exists());

	});


	it('Attempts logging in and changes route on success', async () => {
		const mocks = {
			$store: {
				dispatch: sinon.stub().returns(true)
			},
			$router: {
				push: sinon.spy()
			}
		};
		const wrapper = mount(LoginModal, {
			stubs,
			mocks
		});

		wrapper.setData({
			form: {
				username: 'test',
				password: 'test'
			}
		});

		wrapper.find('button').trigger('click');
		await wrapper.vm.$nextTick();

		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('User/login', {
			username: 'test',
			password: 'test'
		}));

		assert.isTrue(mocks.$router.push.calledOnce);
		assert.isTrue(mocks.$router.push.calledWith('/edit'));


	});
});
