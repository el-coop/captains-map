import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import FollowButton from '@/Components/Dashboard/TopBar/FollowButton';
import sinon from 'sinon';


describe('FollowButton.vue', () => {

	let mocks;
	let stubs;

	beforeEach(() => {
		mocks = {
			$store: {
				state: {
					Webpush: {
						hasPush: true,
						following: []
					}
				},
				dispatch: sinon.stub()
			},
			$toast: {
				error: sinon.stub()
			}
		};
		stubs = {
			FontAwesomeIcon: true
		}
	});

	afterEach(() => {
		sinon.restore();
	});


	it('Renders with follow button', () => {
		const wrapper = shallowMount(FollowButton, {
			propsData: {
				user: 'test'
			},
			mocks,
			stubs
		});

		assert.isTrue(wrapper.find('button.webpush').exists());
		assert.equal(wrapper.find('span').text(), 'Follow');
	});

	it('Renders with follow button', () => {
		mocks.$store.state.Webpush.following = ['test'];
		mocks.$store.state.Webpush.following = ['test'];
		const wrapper = shallowMount(FollowButton, {
			propsData: {
				user: 'test'
			},
			mocks,
			stubs
		});

		assert.isTrue(wrapper.find('button.webpush').exists());
		assert.equal(wrapper.find('span').text(), 'Unfollow');
	});

	it('Toggles following on', async () => {
		mocks.$store.state.Webpush.following = [];
		mocks.$store.dispatch = sinon.stub().returns(201);
		const wrapper = shallowMount(FollowButton, {
			propsData: {
				user: 'test'
			},
			mocks,
			stubs
		});

		wrapper.find('button').trigger('click');

		await wrapper.vm.$nextTick();

		assert.isFalse(wrapper.vm.$data.loading);
		assert.isTrue(wrapper.vm.$data.following);
		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('Webpush/toggleFollow','test'));

	});

	it('Toggles following off', async () => {
		mocks.$store.state.Webpush.following = ["test"];
		mocks.$store.dispatch = sinon.stub().returns(200);
		const wrapper = shallowMount(FollowButton, {
			propsData: {
				user: 'test'
			},
			mocks,
			stubs
		});

		wrapper.find('button').trigger('click');

		await wrapper.vm.$nextTick();

		assert.isFalse(wrapper.vm.$data.loading);
		assert.isFalse(wrapper.vm.$data.following);
		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('Webpush/toggleFollow','test'));

	});

	it('Throws error when result is false', async () => {
		mocks.$store.state.Webpush.following = [];
		mocks.$store.dispatch = sinon.stub().returns(false);
		const wrapper = shallowMount(FollowButton, {
			propsData: {
				user: 'test'
			},
			mocks,
			stubs
		});

		wrapper.find('button').trigger('click');

		await wrapper.vm.$nextTick();

		assert.isFalse(wrapper.vm.$data.loading);
		assert.isFalse(wrapper.vm.$data.following);
		assert.isTrue(mocks.$store.dispatch.calledOnce);
		assert.isTrue(mocks.$store.dispatch.calledWith('Webpush/toggleFollow','test'));
		assert.isTrue(mocks.$toast.error.calledOnce);
		assert.isTrue(mocks.$toast.error.calledWith('Please try again at a later time', 'Following failed.'));

	});
});
