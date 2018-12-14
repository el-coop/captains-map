import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import LoggedInBar from '@/Components/Dashboard/TopBar/LoggedInBar';
import sinon from 'sinon';
import auth from '@/Services/authentication.service';

describe('LoggedInBar.vue', () => {

	let mocks;
	let stubs;

	beforeEach(() => {
		stubs = {
			'font-awesome-icon': true
		};
		mocks = {
			$router: {
				push: sinon.spy(),
				currentRoute: {
					path: '/'
				}
			},
			$store: {
				state: {
					Markers: {
						username: false
					}
				}
			}
		};
		sinon.stub(auth, 'getUserDetails').returns({
			username: 'test'
		});
	});

	afterEach(() => {
		sinon.restore();
	});


	it('Renders with disabled home button in home', () => {
		const wrapper = shallowMount(LoggedInBar, {
			stubs,
			mocks
		});

		assert.equal(wrapper.find('.button.is-light.is-outlined:disabled > span:last-child').text(), 'Home');
		assert.isTrue(wrapper.find('top-bar-stub').exists());
		assert.isTrue(wrapper.find('logout-stub').exists());
		assert.isTrue(wrapper.find('search-bar-stub').exists());
	});

	it('Changes route when edit button clicked', () => {

		const wrapper = shallowMount(LoggedInBar, {
			stubs,
			mocks
		});

		wrapper.findAll('.button.is-light.is-outlined').at(1).trigger('click');

		assert.isTrue(mocks.$router.push.calledOnce);
		assert.isTrue(mocks.$router.push.calledWith('/edit'));

	});

	it('Renders with disabled edit button in edit page', () => {
		mocks.$router.currentRoute.path = "/edit";
		const wrapper = shallowMount(LoggedInBar, {
			stubs,
			mocks
		});
		assert.equal(wrapper.find('.button.is-light.is-outlined:disabled > span:last-child').text(), 'test');

		assert.isTrue(wrapper.find('logout-stub').exists());
		assert.isTrue(wrapper.find('search-bar-stub').exists());
	});

	it('Changes route when home button clicked clicked', () => {
		mocks.$store.state.Markers.username = "test";

		const wrapper = shallowMount(LoggedInBar, {
			stubs,
			mocks
		});

		wrapper.findAll('.button.is-light.is-outlined').at(2).trigger('click');

		assert.isTrue(mocks.$router.push.calledOnce);
		assert.isTrue(mocks.$router.push.calledWith('/'));
	});

	it('Toggles drawer in', () => {
		const wrapper = shallowMount(LoggedInBar, {
			stubs,
			mocks
		});

		wrapper.findAll('.button.is-light.is-outlined').at(0).trigger('click');

		assert.isTrue(wrapper.find('.drawer-mobile--open').exists());
	});

	it('Toggles drawer out', () => {
		const wrapper = shallowMount(LoggedInBar, {
			stubs,
			mocks
		});

		wrapper.setData({
			drawerOpen: true
		});

		wrapper.findAll('.button.is-danger.is-outlined').at(0).trigger('click');

		assert.isFalse(wrapper.find('.drawer-mobile--open').exists());
	});

});