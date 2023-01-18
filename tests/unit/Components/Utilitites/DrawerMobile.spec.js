import { mount } from "@vue/test-utils";
import {describe, it, expect} from 'vitest';
import DrawerMobile from '@/Components/Utilities/DrawerMobile.vue';


describe('DrawerMobile.vue', () => {

	const stubs = {
		FontAwesomeIcon: true
	};

	it('Toggles drawer in', async () => {
		const wrapper = mount(DrawerMobile, {
			global: {
				stubs
			}
		});

		wrapper.vm.open();

		await wrapper.vm.$nextTick();

		expect(wrapper.find('.drawer-mobile--open').exists()).toBeTruthy();
	});

	it('Toggles drawer out with function', () => {
		const wrapper = mount(DrawerMobile, {
			global: {
				stubs
			}
		});

		wrapper.setData({
			drawerOpen: true
		});

		wrapper.find('button').trigger('click');

		expect(wrapper.find('.drawer-mobile--open').exists()).toBeFalsy();
	});

});
