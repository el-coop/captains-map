import { assert } from 'chai';
import { shallowMount, mount } from '@vue/test-utils';
import NotFound from '@/Components/Modals/404.vue';
import sinon from 'sinon';

describe('404.vue', () => {

	const stubs = {
		FontAwesomeIcon: true
	};

	const mocks = {
		$router: {
			currentRoute: {
				fullPath: 'path',
			},
			push: sinon.stub(),
			pushRoute: sinon.stub(),
			back: sinon.stub(),
		},
		$bus: {
			$on: sinon.spy(),
			$off: sinon.spy()
		},
	};

	it('Registers event listeners', () => {
		shallowMount(NotFound, {
			propsData: {
				editMode: true
			},
			stubs,
			mocks
		});

		assert.isTrue(mocks.$bus.$on.calledWith('404'));
		assert.isTrue(mocks.$bus.$on.calledWith('env-setup'));
	});


	it('Removes event listeners', () => {
		const wrapper = shallowMount(NotFound, {
			propsData: {
				editMode: true
			},
			stubs,
			mocks
		});

		wrapper.destroy();

		assert.isTrue(mocks.$bus.$off.calledWith('404'));
		assert.isTrue(mocks.$bus.$off.calledWith('env-setup'));
	});

	it('renders fully when modal active', () => {
		const wrapper = mount(NotFound, {
			mocks,
			stubs
		});

		wrapper.setData({
			modal: true
		});

		assert.isTrue(wrapper.find('img.four04-wrapper__image').exists());
		assert.isTrue(wrapper.find('img.four04-wrapper__cover').exists());
		assert.isTrue(wrapper.find('.modal').exists());
	});

	it('renders without modal when not active', () => {
		const wrapper = mount(NotFound, {
			mocks,
			stubs
		});

		wrapper.setData({
			modal: false
		});

		assert.isFalse(wrapper.find('img.four04-wrapper__image').exists());
		assert.isFalse(wrapper.find('img.four04-wrapper__cover').exists());
		assert.isTrue(wrapper.find('.modal').exists());
	});

	it('It navigates to root when closed', async () => {

		const wrapper = shallowMount(NotFound, {
			stubs,
			mocks
		});

		wrapper.vm.$children[0].$emit('close');

		assert.isTrue(mocks.$router.push.calledWith('/'));
	});

	it('closes modal when take me out of here is clicked', () => {
		const wrapper = mount(NotFound, {
			mocks,
			stubs
		});

		wrapper.setData({
			modal: true
		});

		wrapper.find('a').trigger('click');

		wrapper.setData({
			modal: false
		});
	});

	it('opens modal when method openModal called', () => {
		const wrapper = mount(NotFound, {
			mocks,
			stubs
		});

		wrapper.setData({
			modal: false
		});

		wrapper.vm.openModal();

		wrapper.setData({
			modal: true
		});
	});

	it('closes modal when closeModal called', () => {
		const wrapper = mount(NotFound, {
			mocks,
			stubs
		});

		wrapper.setData({
			modal: true
		});

		wrapper.vm.closeModal();

		wrapper.setData({
			modal: false
		});
	});
});
