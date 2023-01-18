import {describe, it, expect, afterEach} from 'vitest';
import { mount } from '@vue/test-utils';
import RegisterModal from '@/Components/Modals/RegisterModal.vue';
import BaseModal from "@/Components/Utilities/BaseModal.vue"
import sinon from 'sinon';

describe('RegisterModal.vue', () => {

	const stubs = {
		FontAwesomeIcon: true
	};

	const props = {
		active: true
	};

	afterEach(() => {
		sinon.restore();
	});

	it('renders modal when active', () => {
		const wrapper = mount(RegisterModal, {
			global:{
				stubs,
			},
			props
		});

		expect(wrapper.find('.modal').exists()).toBeTruthy();
		expect(wrapper.html()).toContain('Registration is closed at the moment');
	});

	it('doesnt render modal when not active', () => {
		const wrapper = mount(RegisterModal, {
			global:{
				stubs,
			},
		});

		expect(wrapper.find('.modal').exists()).toBeTruthy();
		expect(wrapper.html()).not.toContain('Registration is closed at the moment');
	});

	it('closes modal on click', () => {

		const wrapper = mount(RegisterModal, {
			global:{
				stubs,
			},
			props
		});

		wrapper.find('.card__footer-item a').trigger('click');

		expect(wrapper.emitted()['update:active'][0][0]).toBeFalsy();
	});

	it('closes modal when change emitted form modal', () => {
		const wrapper = mount(RegisterModal, {
			global:{
				stubs,
			},
			props,
		});

		wrapper.findComponent(BaseModal).vm.$emit('update:active', false);

		expect(wrapper.emitted()['update:active'][0][0]).toBeFalsy();
	});
});
