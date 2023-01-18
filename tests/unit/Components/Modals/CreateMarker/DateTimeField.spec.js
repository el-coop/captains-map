import {describe, it, expect} from 'vitest';
import { shallowMount } from '@vue/test-utils';
import DateTimeField from '@/Components/Modals/CreateMarker/DateTimeField.vue';

describe('CreateMarker/DateTimeField.vue', () => {
	it('Renders', () => {
		const wrapper = shallowMount(DateTimeField);

		expect(wrapper.find('.input[type=date]').exists()).toBeTruthy();
		expect(wrapper.find('.input[type=time]').exists()).toBeTruthy();
		expect(wrapper.find('.help.is-danger').exists()).toBeFalsy();
	});

	it('Renders error', () => {
		const wrapper = shallowMount(DateTimeField, {
			props: {
				error: 'Invalid date or time.'
			},
		});

		expect(wrapper.find('.help.is-danger').exists()).toBeTruthy();
		expect(wrapper.find('.help.is-danger').text()).toBe('Invalid date or time.');
	});

	it('Calculates date time', async () => {
		const wrapper = shallowMount(DateTimeField);

		await wrapper.setData({
			date: '2018-12-17',
			time: '13:55'
		});

		const expectedTime = new Date('2018-12-17T13:55Z');

		expect(wrapper.vm.getDateTime()).toEqual(expectedTime);
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

		expect(wrapper.vm.formatDate(Date.now())).toEqual(`${expectedDate.getFullYear()}-${month}-${day}`);
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

		expect(wrapper.vm.formatTime(Date.now())).toEqual(`${hour}:${minutes}`);

	});

	it('It emits input at start', () => {
		const wrapper = shallowMount(DateTimeField);

		expect(wrapper.emitted()['update:modelValue'][0][0], wrapper.vm.getDateTime());
	});


	it('It emits input when time is changed', async () => {
		const wrapper = shallowMount(DateTimeField);

		await wrapper.setData({
			time: '13:55'
		});

		expect(wrapper.emitted()['update:modelValue'][1][0], wrapper.vm.getDateTime());
	});


	it('It emits input when date is changed', async() => {
		const wrapper = shallowMount(DateTimeField);

		await wrapper.setData({
			date: '2018-12-17',
		});


		expect(wrapper.emitted()['update:modelValue'][1][0], wrapper.vm.getDateTime());
	});
});
