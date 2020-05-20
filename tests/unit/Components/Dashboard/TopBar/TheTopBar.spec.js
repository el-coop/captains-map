import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import TheTopBar from '@/Components/Dashboard/TopBar/TheTopBar';
import sinon from 'sinon';

describe('TheTopBar.vue', () => {

	let mocks;
	let stubs;

	beforeEach(() => {
		mocks = {
			$store: {
				state: {
					Markers: {
						username: false
					},
					Stories: {
						story: null
					}
				}
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
			mocks,
			stubs
		});

		assert.isFalse(wrapper.find('ProfileOpen-stub').exists());
		assert.isFalse(wrapper.find('StoriesOpen-stub').exists());
		assert.include(wrapper.find('img').element.src,'globe-icon');
	});

	it('Renders profile when has username and no story', () => {
		mocks.$store.state.Markers.username = 'test';
		const wrapper = shallowMount(TheTopBar, {
			mocks,
			stubs
		});

		assert.isTrue(wrapper.find('ProfileOpen-stub').exists());
		assert.isFalse(wrapper.find('StoriesOpen-stub').exists());
		assert.isFalse(wrapper.find('img').exists());
	});

	it('Renders stories open when story is chosen', () => {
		mocks.$store.state.Markers.username = 'test';
		mocks.$store.state.Stories.story = {
			id: 1
		};
		const wrapper = shallowMount(TheTopBar, {
			mocks,
			stubs
		});

		assert.isFalse(wrapper.find('ProfileOpen-stub').exists());
		assert.isTrue(wrapper.find('StoriesOpen-stub').exists());
		assert.isFalse(wrapper.find('img').exists());
	});
});
