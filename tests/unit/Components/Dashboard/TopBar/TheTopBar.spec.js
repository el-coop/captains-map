import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import {shallowMount} from '@vue/test-utils';
import TheTopBar from '@/Components/Dashboard/TopBar/TheTopBar.vue';
import sinon from 'sinon';
import {createStore} from "vuex";

describe('TheTopBar.vue', () => {

	let stubs;
	let storeOptions;

	beforeEach(() => {
		storeOptions = {
			modules: {
				Markers: {
					namespaced: true,
					state: {
						username: false
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
		stubs = {
			StoriesOpen: true
		};
	});

	afterEach(() => {
		sinon.restore();
	});


	it('Renders without profile when no username', () => {
		const wrapper = shallowMount(TheTopBar, {
			global:{
				plugins: [createStore(storeOptions)],
				stubs
			}
		});

		expect(wrapper.find('profile-open-stub').exists()).toBeFalsy();
		expect(wrapper.find('stories-open-stub').exists()).toBeFalsy();
		expect(wrapper.find('.top-bar__left.top-bar__left--logged-out').exists()).toBeTruthy();
		expect(wrapper.find('img').element.src).toContain('globe-icon');
	});

	it('Renders profile when has username and no story', () => {
		storeOptions.modules.Markers.state.username = 'test';
		const wrapper = shallowMount(TheTopBar, {
			global:{
				plugins: [createStore(storeOptions)],
				stubs
			}
		});

		expect(wrapper.find('profile-open-stub').exists()).toBeTruthy();
		expect(wrapper.find('stories-open-stub').exists()).toBeFalsy();
		expect(wrapper.find('.top-bar__left.top-bar__left--logged-out').exists()).toBeFalsy();
		expect(wrapper.find('img').exists()).toBeFalsy();

	});

	it('Renders stories open when story is chosen', () => {
		storeOptions.modules.Markers.state.username = 'test';
		storeOptions.modules.Stories.state.story = {
			id: 1
		};
		const wrapper = shallowMount(TheTopBar, {
			global:{
				plugins: [createStore(storeOptions)],
				stubs
			}
		});


		expect(wrapper.find('profile-open-stub').exists()).toBeFalsy();
		expect(wrapper.find('stories-open-stub').exists()).toBeTruthy();
		expect(wrapper.find('.top-bar__left.top-bar__left--logged-out').exists()).toBeFalsy();
		expect(wrapper.find('img').exists()).toBeFalsy();

	});
});
