import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import RegisterModal from '@/Components/Modals/RegisterModal';
import sinon from 'sinon';

describe('RegisterModal.vue', () => {

	const stubs = {
		VModal: true,
		FontAwesomeIcon: true
	};

	afterEach(() => {
		sinon.restore();
	});

	it('renders', () => {
		const wrapper = mount(RegisterModal, {
			stubs
		});

		assert.isTrue(wrapper.find('vmodal-stub').exists());
		assert.include(wrapper.html(), 'Registration is closed at the moment');
	});

	it('closes modal on click', () => {
		const mocks = {
			$modal: {
				hide: sinon.spy()
			}
		};
		const wrapper = mount(RegisterModal, {
			stubs,
			mocks
		});

		wrapper.find('a').trigger('click');

		assert.isTrue(mocks.$modal.hide.calledOnce);
		assert.isTrue(mocks.$modal.hide.calledWith('register'));
	});

});
