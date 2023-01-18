import {describe, it, expect} from 'vitest';
import { shallowMount, mount } from '@vue/test-utils';
import NotFound from '@/Components/Modals/404.vue';
import sinon from 'sinon';
import BaseModal from "@/Components/Utilities/BaseModal.vue";

describe('404.vue', () => {

	const stubs = {
		FontAwesomeIcon: true
	};

	const mocks = {
		$router: {
			currentRoute: {
				fullPath: 'path',
			},
			push: sinon.stub(),
			pushRoute: sinon.stub(),
			back: sinon.stub(),
		}
	};

	it('renders fully when modal active', async () => {
		const wrapper = mount(NotFound, {
			global: {
				stubs,
				mocks
			},
			props:{
				active: true
			}
		});


		expect(wrapper.find('img.four04-wrapper__image').exists()).toBeTruthy();
		expect(wrapper.find('img.four04-wrapper__cover').exists()).toBeTruthy();
		expect(wrapper.find('.modal').exists()).toBeTruthy();
	});

	it('renders without modal when not active', async () => {
		const wrapper = mount(NotFound, {
			global: {
				stubs,
				mocks
			},
			props:{
				active: false
			}
		});

		expect(wrapper.find('img.four04-wrapper__image').exists()).toBeFalsy();
		expect(wrapper.find('img.four04-wrapper__cover').exists()).toBeFalsy();
		expect(wrapper.find('.modal').exists()).toBeTruthy();
	});

	it('It navigates to root when closed', async () => {

		const wrapper = shallowMount(NotFound, {
			global: {
				stubs,
				mocks
			},
			props: {
				active: true,
			}
		});

		wrapper.findComponent(BaseModal).vm.$emit('close');

		expect(mocks.$router.push.calledWith('/')).toBeTruthy()
		expect(wrapper.emitted()['update:active'][0][0]).toBeFalsy();
	});

	it('closes modal when take me out of here is clicked', async () => {
		const wrapper = mount(NotFound, {
			global: {
				stubs,
				mocks
			},
			props: {
				active: true
			}
		});

		wrapper.find('a').trigger('click');

		expect(mocks.$router.push.calledWith('/')).toBeTruthy()
		expect(wrapper.emitted()['update:active'][0][0]).toBeFalsy();
	});

});
