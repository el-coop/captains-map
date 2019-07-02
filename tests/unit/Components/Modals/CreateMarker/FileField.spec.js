import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import FileField from '@/Components/Modals/CreateMarker/FileField';
import sinon from 'sinon';

describe('CreateMarker/FileField.vue', () => {
	const stubs = {
		FontAwesomeIcon: true
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


	it('It emits input with display name when image is selected, shows preview', async () => {
		global.URL = {};
		global.URL.createObjectURL = sinon.stub().returns('test');
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

		assert.isTrue(global.URL.createObjectURL.calledOnce);
		assert.isTrue(global.URL.createObjectURL.calledWith({
			name: 'name'
		}));

		assert.equal(wrapper.find('img').element.src, 'http://localhost/test');

		delete global.URL;
	});
});
