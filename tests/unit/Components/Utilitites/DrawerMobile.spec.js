import { mount } from "@vue/test-utils";
import { assert } from 'chai';
import DrawerMobile from '@/Components/Utilities/DrawerMobile';


describe('Logout.vue', () => {

	const stubs = {
		FontAwesomeIcon: true
	};

	it('Toggles drawer in', () => {
		const wrapper = mount(DrawerMobile, {
			stubs
		});

		wrapper.vm.open();

		assert.isTrue(wrapper.find('.drawer-mobile--open').exists());
	});

	it('Toggles drawer out with function', () => {
		const wrapper = mount(DrawerMobile, {
			stubs
		});

		wrapper.setData({
			drawerOpen: true
		});

		wrapper.find('button').trigger('click');

		assert.isFalse(wrapper.find('.drawer-mobile--open').exists());
	});

});
