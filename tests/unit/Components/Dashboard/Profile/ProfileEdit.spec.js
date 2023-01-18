import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import ProfileEdit from '@/Components/Dashboard/Profile/ProfileEdit.vue';
import sinon from 'sinon';
import globe from '@/assets/images/globe-icon.png';
import {createStore} from "vuex";

describe('ProfileEdit.vue', () => {

	let mocks;
	let stubs;
	let storeOptions;

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
						}
					},
					mutations: {
						updateBio() {
						}
					}
				},
				User: {
					namespaced: true,
					state: {
						user: null
					}
				},
				Markers: {
					namespaced: true,
					mutations: {
						updateProfilePic() {
						}
					}
				}
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
			FontAwesomeIcon: true,
			MultiFileField: true
		};
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Renders profile with globe picture', async () => {
		const wrapper = mount(ProfileEdit, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		expect(wrapper.find('.dashboard__control.profile').exists()).toBeTruthy();
		expect(wrapper.find('multi-file-field-stub').attributes().preview).toBe(globe);
		expect(wrapper.find('h4').text()).toBe('test');
		expect(wrapper.vm.$data.description).toBe('description');
	});

	it('Renders profile with actual profile picture', async () => {

		storeOptions.modules.Profile.state.user.path = '/path';

		const wrapper = mount(ProfileEdit, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		expect(wrapper.find('.dashboard__control.profile').exists()).toBeTruthy();
		expect(wrapper.find('multi-file-field-stub').attributes().preview).toBe('/api/path');
		expect(wrapper.find('h4').text()).toBe('test');
		expect(wrapper.vm.$data.description).toBe('description');
	});

	it('Reacts to failure submission', async () => {

		mocks.$http.post = sinon.stub().returns({
			status: 500,
		});
		storeOptions.modules.Profile.state.user.path = '/path';

		const wrapper = mount(ProfileEdit, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		wrapper.find('button.is-primary-background').trigger('click');

		await wrapper.vm.$nextTick;

		expect(mocks.$toast.error.calledOnce).toBeTruthy();
		expect(mocks.$toast.error.calledWith('Please try again at a later time', 'Update failed.')).toBeTruthy();
	});

	it('Submits data successfully', async () => {

		storeOptions.modules.User.state.user = {
			username: 'test'
		};

		mocks.$http.post = sinon.stub().returns({
			status: 200,
			data: {
				description: 'desc',
				path: 'patha'
			}
		});
		storeOptions.modules.Profile.state.user.path = '/path';
		const updateProfilePicStub = sinon.stub();
		const updateBioStub = sinon.stub();
		storeOptions.modules.Profile.mutations.updateBio = updateBioStub;
		storeOptions.modules.Markers.mutations.updateProfilePic = updateProfilePicStub;


		const wrapper = mount(ProfileEdit, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs,
				mocks
			}
		});

		wrapper.find('button.is-primary-background').trigger('click');

		await wrapper.vm.$nextTick();

		expect(wrapper.find('button.is-primary-background.is-loading').exists()).toBeTruthy();

		await wrapper.vm.$nextTick();

		expect(wrapper.find('button.is-primary-background.is-loading').exists()).toBeFalsy();

		expect(mocks.$toast.success.calledOnce).toBeTruthy();
		expect(mocks.$toast.success.calledWith(' ', 'Profile updated.')).toBeTruthy();

		expect(updateProfilePicStub.calledOnce).toBeTruthy();
		expect(updateProfilePicStub.calledWith({}, {
			username: 'test',
			path: 'patha'
		})).toBeTruthy();
		expect(updateBioStub.calledOnce).toBeTruthy();
		expect(updateBioStub.calledWith(sinon.match.any, {
			username: 'test',
			description: 'desc',
			path: 'patha'
		})).toBeTruthy();
	});

});
