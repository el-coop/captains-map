import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import FileField from '@/Components/Modals/CreateMarker/FileField';
import sinon from 'sinon';

describe('CreateMarker/FileField.vue', () => {
	const stubs = {
		'font-awesome-icon': true
	};

	it('Renders', () => {
		const wrapper = shallowMount(FileField, {
			stubs
		});

		assert.isTrue(wrapper.find('.file-input[type=file]').exists());
		assert.isFalse(wrapper.find('.help.is-danger').exists());
		assert.equal(wrapper.find('.file-name').text(), 'Choose an image');
	});

	it('Renders error', () => {
		const wrapper = shallowMount(FileField, {
			stubs,
			propsData: {
				error: 'Error'
			},
		});


		assert.isTrue(wrapper.find('.help.is-danger').exists());
		assert.equal(wrapper.find('.help.is-danger').text(), 'Error');

	});


	it('It emits input and display name when image selected', async () => {
		const wrapper = shallowMount(FileField, {
			stubs
		});

		wrapper.vm.imageSelected({
			target: {
				files: [{
					name: 'name'
				}]
			}
		});

		assert.deepEqual(wrapper.emitted().input[0][0], {
			name: 'name'
		});
	});
});
