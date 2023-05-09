import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import {shallowMount} from '@vue/test-utils';
import UploadEntry from '@/Components/Dashboard/SideBar/UploadEntry.vue';
import sinon from 'sinon';
import map from '@/Services/LeafletMapService';
import UploadFile from "@/Classes/UploadFile";
import {createStore} from "vuex";

;

describe('UploadEntry.vue', () => {
	let marker;
	let storeOptions;
	let stubs;
	const file = new UploadFile('name', 'image');

	beforeEach(() => {
		global.window.matchMedia = sinon.stub().returns({
			matches: false
		});

		storeOptions = {
			modules: {
				Uploads: {
					namespaced: true,
					state: {
						workingId: 1,
						progress: null
					},
					mutations: {
						markAsWorking(state, id) {
							state.workingId = id;
						},
						setProgress(state, progress) {
							state.progress = progress;
						}

					}
				},
				Profile: {
					namespaced: true,
					state: {
						user: {
							path: '/wrath'
						}
					}
				}
			}
		};
		stubs = {
			FontAwesomeIcon: true
		};
		marker = {
			media: {
				type: 'image',
				path: 'https://www.instagram.com/p/path/',
				files: [
					file
				]
			},
			description: 'Z0ZX6tdEBGAZYYCJT1NPZ0ZX6tdEBGAZYYCJT1NPZ0ZX6tdEBGAZYYCJT1NP',
			lat: 1,
			lng: 1,
			user: {
				username: 'test'
			},
			time: '2018-10-06 15:43:57',
			uploadTime: 2
		};
	});


	afterEach(() => {
		sinon.restore();
		delete global.window.matchMedia;
	});

	it('Renders', async () => {
		const wrapper = shallowMount(UploadEntry, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			},
			props: {
				marker
			}
		});

		await wrapper.vm.$nextTick();

		expect(wrapper.find('.marker-entry__card-image').exists()).toBeTruthy();
		expect(wrapper.find('.marker-entry__card-content').text()).toBe('Z0ZX6tdEBGAZYYCJT1NPZ0ZX6tdEBGAZYYCJT1NPZ0...');
		expect(wrapper.find('.marker-entry__card-profile-img').attributes().src).toBe('/api/wrath');
		expect(wrapper.find('.progress').exists()).toBeFalsy();
	});

	it('Calculates image src for image type', async () => {
		const wrapper = shallowMount(UploadEntry, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			},
			props: {
				marker
			}
		});

		await wrapper.vm.$nextTick();

		expect(wrapper.vm.$data.src).toBe(file.preview);
	});

	it('Calculates image src for instagram type', async () => {
		marker.media.type = 'instagram';

		const wrapper = shallowMount(UploadEntry, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			},
			props: {
				marker
			}
		});

		await wrapper.vm.$nextTick();

		expect(wrapper.vm.$data.src).toBe(`/api/marker/instagram/p/path`);
	});

	it('Reacts to click', () => {
		const mapMoveStub = sinon.stub(map, 'move');
		const wrapper = shallowMount(UploadEntry, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			},
			props: {
				marker
			}
		});

		wrapper.find('.marker-entry__card').trigger('click');

		expect(mapMoveStub.calledOnce).toBeTruthy();
		expect(mapMoveStub.calledWith([1, 1], 16)).toBeTruthy();
	});

	it('Sets classname to queued when queued', () => {
		const wrapper = shallowMount(UploadEntry, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			},
			props: {
				marker
			}
		});
		expect(wrapper.vm.$data.className).toBe('queued');
		expect(wrapper.find('.queued').exists()).toBeTruthy();
	});

	it('Sets classname to uploading when uploading', async () => {
		const mockStore = createStore(storeOptions);
		const wrapper = shallowMount(UploadEntry, {
			global: {
				plugins: [mockStore],
				stubs
			},
			props: {
				marker
			}
		});

		mockStore.commit('Uploads/markAsWorking', marker.uploadTime)
		await wrapper.vm.$nextTick();

		expect(wrapper.vm.$data.className).toBe('uploading');
		expect(wrapper.find('.uploading').exists()).toBeTruthy();
	});

	it('Shows progress bar with progress value when uploading and progress value exists', async () => {
		const mockStore = createStore(storeOptions);
		const wrapper = shallowMount(UploadEntry, {
			global: {
				plugins: [mockStore],
				stubs
			},
			props: {
				marker
			}
		});

		mockStore.commit('Uploads/markAsWorking', marker.uploadTime)
		mockStore.commit('Uploads/setProgress', 40)

		await wrapper.vm.$nextTick();
		const progressBar = wrapper.find('.progress');
		expect(progressBar.exists()).toBeTruthy();
		expect(progressBar.attributes().value).toBe('40');
	});

	it('Shows progress bar withiout progress value when uploading and progress value doenst exist', async () => {
		const mockStore = createStore(storeOptions);
		const wrapper = shallowMount(UploadEntry, {
			global: {
				plugins: [mockStore],
				stubs
			},
			props: {
				marker
			}
		});

		mockStore.commit('Uploads/markAsWorking', marker.uploadTime)
		await wrapper.vm.$nextTick();
		const progressBar = wrapper.find('.progress');
		expect(progressBar.exists()).toBeTruthy();
		expect(progressBar.attributes().value).toBe('0');

	});

	it('Sets classname to error when has errors', () => {
		marker.error = {
			test: 'best'
		};

		const wrapper = shallowMount(UploadEntry, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			},
			props: {
				marker
			}
		});

		expect(wrapper.vm.$data.className).toBe('error');
		expect(wrapper.find('.error').exists()).toBeTruthy();
	});

	it('Updates marker preview when changed', async () => {
		const marker2 = {
			media: {
				type: 'image',
				path: 'https://www.instagram.com/p/path/',
				files: [
					new UploadFile('name1', 'image1')
				]
			},
			description: 'Z0ZX6tdEBGAZYYCJT1NPZ0ZX6tdEBGAZYYCJT1NPZ0ZX6tdEBGAZYYCJT1NP',
			lat: 1,
			lng: 1,
			user: {
				username: 'test',
			},
			time: '2018-10-06 15:43:57',
			uploadTime: 2
		};

		const wrapper = shallowMount(UploadEntry, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			},
			props: {
				marker
			}
		});

		await wrapper.vm.$nextTick();

		expect(wrapper.vm.$data.src).toBe(file.preview);

		await wrapper.setProps({
			marker: marker2
		});

		expect(wrapper.vm.$data.src).toBe(marker2.media.files[0].preview);

	});
});

