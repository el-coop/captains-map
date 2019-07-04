import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import LoggedInBar from '@/Components/Dashboard/TopBar/LoggedInBar';
import sinon from 'sinon';
import auth from '@/Services/AuthenticationService';

describe('LoggedInBar.vue', () => {

	let mocks;
	let stubs;

	beforeEach(() => {
		stubs = {
			FontAwesomeIcon: true,
			ProfileOpen: true
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
		const wrapper = mount(LoggedInBar, {
			stubs,
			mocks
		});

		assert.equal(wrapper.find('.button.is-light.is-outlined:disabled > span:last-child').text(), 'Home');
		assert.isTrue(wrapper.find('.top-bar').exists());
		assert.isTrue(wrapper.find('.button.is-danger.is-outlined').exists());
		assert.isTrue(wrapper.find('.search-bar').exists());
	});

	it('Changes route when edit button clicked', () => {

		const wrapper = mount(LoggedInBar, {
			stubs,
			mocks
		});

		wrapper.findAll('.button.is-light.is-outlined').at(1).trigger('click');

		assert.isTrue(mocks.$router.push.calledOnce);
		assert.isTrue(mocks.$router.push.calledWith('/edit'));

	});

	it('Renders with disabled edit button in edit page', () => {
		mocks.$router.currentRoute.path = "/edit";
		const wrapper = mount(LoggedInBar, {
			stubs,
			mocks
		});
		assert.equal(wrapper.find('.button.is-light.is-outlined:disabled > span:last-child').text(), 'test');

		assert.isTrue(wrapper.find('.button.is-danger.is-outlined').exists());
		assert.isTrue(wrapper.find('.search-bar').exists());
	});

	it('Changes route when home button clicked clicked', () => {
		mocks.$store.state.Markers.username = "test";

		const wrapper = mount(LoggedInBar, {
			stubs,
			mocks
		});

		wrapper.findAll('.button.is-light.is-outlined').at(2).trigger('click');

		assert.isTrue(mocks.$router.push.calledOnce);
		assert.isTrue(mocks.$router.push.calledWith('/'));
	});

});
