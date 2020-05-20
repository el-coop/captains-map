import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import StoriesOpen from '@/Components/Dashboard/TopBar/StoriesOpen';
import sinon from 'sinon';


describe('StoriesOpen.vue', () => {

	let mocks;
	let stubs;

	beforeEach(() => {
		mocks = {
			$store: {
				state: {
					Stories: {
						story: {
							name: 'story1'
						}
					}
				},
				commit: sinon.stub()
			},
			$toast: {
				success: sinon.stub()
			},
			$route: {
				params: {
					username: 'username'
				}
			},
			$router: {
				push: sinon.stub()
			}
		};

		stubs = {
			FontAwesomeIcon: true,
			StoryEditModal: true
		};
	});

	afterEach(() => {
		sinon.restore();
	});


	it('Renders', () => {
		const wrapper = shallowMount(StoriesOpen, {
			mocks,
			stubs
		});

		assert.include(wrapper.text(), 'story1');
		assert.isTrue(wrapper.find('StoryEditModal-stub').exists());
		assert.isTrue(wrapper.find('.profile-open').exists());
	});

	it('Exists story when exit clicked', () => {
		const wrapper = shallowMount(StoriesOpen, {
			mocks,
			stubs
		});

		wrapper.find('button.webpush').trigger('click');

		assert.isTrue(mocks.$router.push.calledOnce);
		assert.isTrue(mocks.$router.push.calledWith('/username'));
	});

	it('Opens edit modal when edit is clicked', () => {
		const wrapper = shallowMount(StoriesOpen, {
			mocks,
			stubs
		});

		wrapper.find('button.profile-open__button').trigger('click');

		assert.isTrue(wrapper.vm.$data.edit);
	});

	it('Closes edit modal when signled from modal', () => {
		const wrapper = shallowMount(StoriesOpen, {
			mocks,
			stubs
		});

		wrapper.find('StoryEditModal-stub').trigger('saved');

		assert.isFalse(wrapper.vm.$data.edit);
	});
});
