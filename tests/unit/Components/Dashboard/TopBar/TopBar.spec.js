import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import TopBar from '@/Components/Dashboard/TopBar/TopBar';
import sinon from 'sinon';

describe('TopBar.vue', () => {

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
		const wrapper = shallowMount(TopBar, {
			mocks
		});

		assert.isFalse(wrapper.find('profileopen-stub').exists());
		assert.include(wrapper.find('img').element.src,'globe-icon');
	});

	it('Renders profile when no username', () => {
		mocks.$store.state.Markers.username = 'test';
		const wrapper = shallowMount(TopBar, {
			mocks
		});

		assert.isTrue(wrapper.find('profileopen-stub').exists());
		assert.isFalse(wrapper.find('img').exists());
	});
});