import {describe, it, expect} from 'vitest';
import { shallowMount } from '@vue/test-utils';
import Logout from '@/Components/Utilities/Logout.vue';
import {createStore} from 'vuex'
import sinon from 'sinon';

describe('Logout.vue', () => {

	it('Renders', () => {
		const wrapper = shallowMount(Logout, {
			global: {
				stubs: {
					FontAwesomeIcon: true
				}
			}
		});

		expect(wrapper.find('font-awesome-icon-stub[icon=sign-out-alt]').exists()).toBeTruthy();
	});

	it('Logsout on click', () => {
		const User = {
			namespaced: true,
			actions: {
				logout: sinon.spy()
			},
		};
		const store = createStore({
			modules: {
				User
			}
		});
		const wrapper = shallowMount(Logout, {
			global: {
				plugins:[store]	,
				stubs: {
					FontAwesomeIcon: true
				}
			},

		});

		wrapper.find('button').trigger('click');

		expect(User.actions.logout.calledOnce).toBeTruthy();
	});

});
