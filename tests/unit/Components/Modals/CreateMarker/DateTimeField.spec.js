import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import DateTimeField from '@/Components/Modals/CreateMarker/DateTimeField';

describe('CreateMarker/DateTimeField.vue', () => {
	it('Renders', () => {
		const wrapper = shallowMount(DateTimeField);

		assert.isTrue(wrapper.find('.input[type=date]').exists());
		assert.isTrue(wrapper.find('.input[type=time]').exists());
		assert.isFalse(wrapper.find('.help.is-danger').exists());
	});

	it('Renders error', () => {
		const wrapper = shallowMount(DateTimeField, {
			propsData: {
				error: 'Error'
			},
		});

		const error = wrapper.find('.help.is-danger');

		assert.isTrue(wrapper.find('.help.is-danger').exists());
		assert.equal(wrapper.find('.help.is-danger').text(), 'Invalid date or time.');
	});

	it('Calculates date time', () => {
		const wrapper = shallowMount(DateTimeField);

		wrapper.setData({
			date: '2018-12-17',
			time: '13:55'
		});

		const expectedTime = new Date('2018-12-17 13:55');

		assert.deepEqual(wrapper.vm.getDateTime(), expectedTime);
	});


	it('It gets current date formatted', () => {
		const wrapper = shallowMount(DateTimeField);

		const expectedDate = new Date();
		let day = expectedDate.getDate();
		if (day < 10) {
			day = `0${day}`;
		}

		let month = expectedDate.getMonth() + 1;
		if (month < 10) {
			month = `0${month}`;
		}


		assert.deepEqual(wrapper.vm.getCurrentDate(), `${expectedDate.getFullYear()}-${month}-${day}`);
	});

	it('It gets current time formatted', () => {
		const wrapper = shallowMount(DateTimeField);

		const expectedDate = new Date();
		let hour = expectedDate.getHours();
		if (hour < 10) {
			hour = `0${hour}`;
		}

		let minutes = expectedDate.getMinutes();
		if (minutes < 10) {
			minutes = `0${minutes}`;
		}

		assert.deepEqual(wrapper.vm.getCurrentTime(), `${hour}:${minutes}`);
	});

	it('It emits input when time is changed', () => {
		const wrapper = shallowMount(DateTimeField);

		wrapper.setData({
			time: '13:55'
		});


		assert.deepEqual(wrapper.emitted().input[0][0], wrapper.vm.getDateTime());
	});


	it('It emits input when date is changed', () => {
		const wrapper = shallowMount(DateTimeField);

		wrapper.setData({
			date: '2018-12-17',
		});


		assert.deepEqual(wrapper.emitted().input[0][0], wrapper.vm.getDateTime());
	});
});
