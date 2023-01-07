import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import {shallowMount} from '@vue/test-utils';
import UploadsList from '@/Components/Dashboard/SideBar/UploadsList.vue';
import sinon from 'sinon';
import {createStore} from "vuex";


describe('UploadsList.vue', () => {
	let storeOptions;
	const stubs = {
		FontAwesomeIcon: true
	};

	beforeEach(() => {
		storeOptions = {
			modules: {
				Uploads: {
					namespaced: true,
					getters: {
						allFiles() {
							return new Array(3).fill({lat: 0, lng: 0});
						}
					}
				}
			}
		}
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Renders', () => {
		const wrapper = shallowMount(UploadsList, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			}
		});

		expect(wrapper.find('button.is-faded').exists()).toBeTruthy();
		expect(wrapper.find('ul').exists()).toBeFalsy();
	});

	it('Shows list when button clicked', async () => {
		const wrapper = shallowMount(UploadsList, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			}
		});

		await wrapper.setData({
			open: false
		});

		wrapper.find('button.is-faded').trigger('click');
		await wrapper.vm.$nextTick();
		expect(wrapper.find('ul').exists()).toBeTruthy();
	});


	it('Closes list when button clicked and list open', async () => {
		const wrapper = shallowMount(UploadsList, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			}
		});


		await wrapper.setData({
			open: true
		});

		wrapper.find('button.is-faded').trigger('click');
		await wrapper.vm.$nextTick();
		expect(wrapper.find('ul').exists()).toBeFalsy();
	});

	it('Lists all the different upload entries', async () => {
		const wrapper = shallowMount(UploadsList, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			}
		});

		await wrapper.setData({
			open: true
		});

		expect(wrapper.findAll('upload-entry-stub').length).toBe(3);
	});
});
