import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import LoggedInBar from '@/Components/Dashboard/TopBar/LoggedInBar';
import sinon from 'sinon';

describe('LoggedInBar.vue', () => {

	let mocks;
	let stubs;

	beforeEach(() => {
		stubs = {
			FontAwesomeIcon: true,
			SearchBar: true,
			ProfileOpen: true,
			DrawerMobile: true,
			logout: true,
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
					},
					User: {
						user: {
							username: 'user',
						},
						isLoggedIn: sinon.stub().returns(true)
					},
					Stories: {
						story: null
					}
				}
			}
		};

	});

	afterEach(() => {
		sinon.restore();
	});


	it('Renders with disabled home button in home', () => {
		const wrapper = mount(LoggedInBar, {
			stubs,
			mocks
		});

		assert.equal(wrapper.find('.button:disabled > span:last-child').text(), 'Home');
		assert.isTrue(wrapper.find('.top-bar').exists());
		assert.isTrue(wrapper.find('.button--logout').exists());
		assert.isTrue(wrapper.find('searchbar-stub').exists());
	});

	it('Changes route when edit button clicked', () => {

		const wrapper = mount(LoggedInBar, {
			stubs,
			mocks
		});

		wrapper.findAll('.button').at(1).trigger('click');

		assert.isTrue(mocks.$router.push.calledOnce);
		assert.isTrue(mocks.$router.push.calledWith('/edit'));

	});

	it('Renders with disabled edit button in edit page', () => {
		mocks.$router.currentRoute.path = "/edit";

		const wrapper = mount(LoggedInBar, {
			stubs,
			mocks
		});
		assert.equal(wrapper.find('.button:disabled > span:last-child').text(), 'user');
		assert.isTrue(wrapper.find('.button').exists());
		assert.isTrue(wrapper.find('searchbar-stub').exists());
	});

	it('Changes route when home button clicked clicked', () => {
		mocks.$store.state.Markers.username = "test";

		const wrapper = mount(LoggedInBar, {
			stubs,
			mocks
		});

		wrapper.findAll('.button').at(2).trigger('click');

		assert.isTrue(mocks.$router.push.calledOnce);
		assert.isTrue(mocks.$router.push.calledWith('/'));
	});

});
