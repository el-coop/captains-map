import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import ProfileDisplay from '@/Components/Dashboard/Profile/ProfileDisplay.vue';
import sinon from 'sinon';
import globe from '@/assets/images/globe-icon.png';
import {createStore} from "vuex";

describe('ProfileDisplay.vue', () => {

	let mocks;
	let storeOptions;
	let stubs;

	beforeEach(() => {
		storeOptions = {
			modules: {
				Profile: {
					namespaced: true,
					state: {
						user: {
							username: 'test',
							description: 'description',
							path: false
						},
						open: true
					}
				},
				User: {
					namespaced: true,
					state: {
						user: null
					}
				},
				Stories: {
					namespaced: true,
					state: {
						story: null
					}
				},
			}
		};
		mocks = {
			$http: {},
			$toast: {
				success: sinon.stub(),
				error: sinon.stub()
			}
		};
		stubs = {
			FontAwesomeIcon: true
		};
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Renders profile with globe picture', async () => {
		const wrapper = mount(ProfileDisplay, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		await wrapper.vm.$nextTick();

		expect(wrapper.find('img').element.src).toBe(`http://localhost:3000${globe}`);
		expect(wrapper.find('h4').text()).toBe('test');
		expect(wrapper.find('.profile__content-text').text()).toBe('description');
	});

	it('Renders profile with actual profile picture', async () => {

		storeOptions.modules.Profile.state.user.path = '/path';
		const wrapper = mount(ProfileDisplay, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});


		await wrapper.vm.$nextTick();

		expect(wrapper.find('img').element.src).toBe(`http://localhost:3000/api/path`);
		expect(wrapper.find('h4').text()).toBe('test');
		expect(wrapper.find('.profile__content-text').text()).toBe('description');
	});
});
