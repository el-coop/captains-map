import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import LoginModal from '@/Components/Modals/LoginModal';
import sinon from 'sinon';

describe('LoginModal.vue', () => {
	const stubs = {
		FontAwesomeIcon: true
	};

	const propsData = {
		active: true
	};

	const mocks = {
		$store: {
			dispatch: sinon.stub().returns(false)
		},
		$router: {
			push: sinon.spy()
		}
	};

	afterEach(() => {
		sinon.restore();
	});

	it('renders modal when active', () => {
		const wrapper = mount(LoginModal, {
			propsData,
			stubs
		});

		assert.isTrue(wrapper.find('.modal').exists());
		assert.include(wrapper.html(), 'Login');
	});

	it('doesnt render modal when not active', () => {
		const wrapper = mount(LoginModal, {
			stubs
		});

		assert.isTrue(wrapper.find('.modal').exists());
		assert.notInclude(wrapper.html(), 'Login');
	});

	it('closes modal on click', () => {
		const wrapper = mount(LoginModal, {
			stubs,
			propsData,
		});

		wrapper.find('.card-footer-item a').trigger('click');

		assert.equal(wrapper.emitted()['update:active'][0][0], false);
	});

	it('closes modal when emitted form modal', () => {
		const wrapper = mount(LoginModal, {
			stubs,
			propsData,
		});

		wrapper.vm.$children[0].$emit('update:active',false);

		assert.equal(wrapper.emitted()['update:active'][0][0], false);
	});

	it('Attempts logging in and shows errors', async () => {

		const wrapper = mount(LoginModal, {
			stubs,
			mocks,
			propsData
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
		mocks.$store.dispatch = sinon.stub().returns(true);
		const wrapper = mount(LoginModal, {
			stubs,
			mocks,
			propsData
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
