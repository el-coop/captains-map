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
				'font-awesome-icon': true
			}
		});

		assert.isTrue(wrapper.find('font-awesome-icon-stub[icon=power-off]').exists());
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
				'font-awesome-icon': true
			}
		});

		wrapper.find('button').trigger('click');

		assert.isTrue(User.actions.logout.calledOnce);
	});

});