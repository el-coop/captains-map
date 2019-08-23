import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import RegisterModal from '@/Components/Modals/RegisterModal';
import sinon from 'sinon';

describe('RegisterModal.vue', () => {

	const stubs = {
		FontAwesomeIcon: true
	};

	const propsData = {
		active: true
	};

	afterEach(() => {
		sinon.restore();
	});

	it('renders modal when active', () => {
		const wrapper = mount(RegisterModal, {
			stubs,
			propsData
		});

		assert.isTrue(wrapper.find('.modal').exists());
		assert.include(wrapper.html(), 'Registration is closed at the moment');
	});

	it('doesnt render modal when not active', () => {
		const wrapper = mount(RegisterModal, {
			stubs,
		});

		assert.isTrue(wrapper.find('.modal').exists());
		assert.notInclude(wrapper.html(), 'Registration is closed at the moment');
	});

	it('closes modal on click', () => {

		const wrapper = mount(RegisterModal, {
			stubs,
			propsData
		});

		wrapper.find('.card-footer-item a').trigger('click');

		assert.equal(wrapper.emitted().change[0][0], false);
	});

	it('closes modal when emitted form modal', () => {
		const wrapper = mount(RegisterModal, {
			stubs,
			propsData,
		});

		wrapper.vm.$children[0].$emit('close');

		assert.equal(wrapper.emitted().change[0][0], false);
	});
});
