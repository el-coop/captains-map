import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import RegisterModal from '@/Components/Modals/RegisterModal';
import sinon from 'sinon';

describe('RegisterModal.vue', () => {
	afterEach(() => {
		sinon.restore();
	});

	it('renders', () => {
		const wrapper = mount(RegisterModal, {
			stubs: {
				modal: true,
				fontAwesomeIcon: true
			}
		});

		assert.isTrue(wrapper.find('modal-stub').exists());
		assert.include(wrapper.html(), 'Registration is closed at the moment');
	});

	it('closes modal on click', () => {
		const mocks = {
			$modal: {
				hide: sinon.spy()
			}
		};
		const wrapper = mount(RegisterModal, {
			stubs: {
				modal: true,
				fontAwesomeIcon: true
			},
			mocks
		});

		wrapper.find('a').trigger('click');

		assert.isTrue(mocks.$modal.hide.calledOnce);
		assert.isTrue(mocks.$modal.hide.calledWith('register'));
	});

});
