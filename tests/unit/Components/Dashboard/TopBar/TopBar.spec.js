import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import TopBar from '@/Components/Dashboard/TopBar/TopBar';
import Auth from '@/Services/authentication.service';
import sinon from 'sinon';

describe('TopBar.vue', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('Renders logged out bar when no user', () => {
		const wrapper = shallowMount(TopBar);

		assert.isTrue(wrapper.find('loggedoutbar-stub').exists());
		assert.isFalse(wrapper.find('loggedinbar-stub').exists());
	});


	it('Renders logged in bar when authenticated', () => {
		sinon.stub(Auth, 'isLoggedIn').returns(true);
		const wrapper = shallowMount(TopBar);

		assert.isFalse(wrapper.find('loggedoutbar-stub').exists());
		assert.isTrue(wrapper.find('loggedinbar-stub').exists());
	});
});