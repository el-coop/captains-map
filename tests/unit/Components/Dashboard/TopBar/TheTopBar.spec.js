import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import TheTopBar from '@/Components/Dashboard/TopBar/TheTopBar';
import sinon from 'sinon';

describe('TheTopBar.vue', () => {

	let mocks;

	beforeEach(() => {
		mocks = {
			$store: {
				state: {
					Markers: {
						username: false
					}
				}
			}
		};
	});

	afterEach(() => {
		sinon.restore();
	});


	it('Renders without profile when no username', () => {
		const wrapper = shallowMount(TheTopBar, {
			mocks
		});

		assert.isFalse(wrapper.find('ProfileOpen-stub').exists());
		assert.include(wrapper.find('img').element.src,'globe-icon');
	});

	it('Renders profile when no username', () => {
		mocks.$store.state.Markers.username = 'test';
		const wrapper = shallowMount(TheTopBar, {
			mocks
		});

		assert.isTrue(wrapper.find('ProfileOpen-stub').exists());
		assert.isFalse(wrapper.find('img').exists());
	});
});
