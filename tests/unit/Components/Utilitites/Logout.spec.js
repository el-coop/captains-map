import { assert } from 'chai';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Logout from '@/Components/Utilities/Logout';
import Vuex from 'vuex'
import sinon from 'sinon';

const localVue = createLocalVue();

localVue.use(Vuex);


describe('Logout.vue', () => {

	it('Renders', () => {
		const wrapper = shallowMount(Logout, {
			stubs: {
				FontAwesomeIcon: true
			}
		});

		assert.isTrue(wrapper.find('fontawesomeicon-stub[icon=sign-out-alt]').exists());
	});

	it('Logsout on click', () => {
		const User = {
			namespaced: true,
			actions: {
				logout: sinon.spy()
			},
		};
		const store = new Vuex.Store({
			modules: {
				User
			}
		});
		const wrapper = shallowMount(Logout, {
			store,
			localVue,
			stubs: {
				FontAwesomeIcon: true
			}
		});

		wrapper.find('button').trigger('click');

		assert.isTrue(User.actions.logout.calledOnce);
	});

});
