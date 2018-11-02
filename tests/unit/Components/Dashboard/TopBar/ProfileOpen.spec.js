import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import ProfileOpen from '@/Components/Dashboard/TopBar/ProfileOpen';
import sinon from 'sinon';
import auth from '@/Services/authentication.service';

describe('ProfileOpen.vue', () => {

	let mocks;

	beforeEach(() => {
		mocks = {
			$store: {
				state: {
					Markers: {
						username: 'test'
					}
				}
			}
		};
		sinon.stub(auth, 'getUserDetails').returns({
			username: 'test'
		});
	});

	afterEach(() => {
		sinon.restore();
	});


	it('Renders username and globe icon', () => {
		const wrapper = shallowMount(ProfileOpen, {
			mocks
		});

		assert.equal(wrapper.find('span.button-text').text(), 'test');
		assert.include(wrapper.find('img').element.src, 'globe-icon');
	});

});