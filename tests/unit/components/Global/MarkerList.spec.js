import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import MarkerList from '@/components/global/MarkerList';
import sinon from 'sinon';

const pageSize = parseInt(process.env.VUE_APP_PAGE_SIZE);

describe('MarkerList.vue', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('Renders', () => {
		const wrapper = shallowMount(MarkerList, {
			mocks: {
				$store: {
					state: {
						Markers: {
							markers: [],
							hasNext: false,
							page: 0
						},
					}
				}
			}
		});

		assert.isTrue(wrapper.find('ul').exists());
	});

	it('Renders list of markers and hides pagination when no hasNext', () => {
		const wrapper = shallowMount(MarkerList, {
			mocks: {
				$store: {
					state: {
						Markers: {
							markers: [{
								id: 1
							}, {
								id: 2
							}],

							hasNext: false,
							page: 0
						},
					}
				}
			}
		});

		assert.equal(wrapper.findAll('markerentry-stub').length, 2);
		assert.isFalse(wrapper.findAll('.buttons').exists());
	});

	it('Renders markers and pagination buttons when there is next', () => {
		const wrapper = shallowMount(MarkerList, {
			mocks: {
				$store: {
					state: {
						Markers: {
							markers: [{
								id: 1
							}, {
								id: 2
							}],
							hasNext: true,
							page: 0
						},
					}
				}
			}
		});

		assert.equal(wrapper.findAll('markerentry-stub').length, 2);
		assert.isTrue(wrapper.find('.buttons').exists());
	});

	it('Renders markers and pagination buttons when not on last page', () => {
		const wrapper = shallowMount(MarkerList, {
			mocks: {
				$store: {
					state: {
						Markers: {
							markers: new Array(pageSize * 5).fill({}),
							hasNext: false,
							page: 2
						},
					}
				}
			}
		});

		assert.equal(wrapper.findAll('markerentry-stub').length, 5);
		assert.isTrue(wrapper.find('.buttons').exists());
	});

	it('Disables next button when needs to be', async () => {
		const wrapper = shallowMount(MarkerList, {
			mocks: {
				$store: {
					state: {
						Markers: {
							markers: new Array(pageSize * 3).fill({}),
							hasNext: false,
							page: 2
						},
					}
				}
			}
		});

		await wrapper.vm.$nextTick();

		const nextButton = wrapper.find('.button:disabled');
		assert.isTrue(nextButton.exists());
		assert.include(nextButton.text(), 'Next');
	});

	it('Disables prev button when needs to be', async () => {
		const wrapper = shallowMount(MarkerList, {
			mocks: {
				$store: {
					state: {
						Markers: {
							markers: new Array(pageSize * 3).fill({}),
							hasNext: false,
							page: 0
						},
					}
				}
			}
		});

		await wrapper.vm.$nextTick();

		const prevButton = wrapper.find('.button:disabled');
		assert.isTrue(prevButton.exists());
		assert.include(prevButton.text(), 'Previous');
	});

	it('Enables both buttons', async () => {
		const wrapper = shallowMount(MarkerList, {
			mocks: {
				$store: {
					state: {
						Markers: {
							markers: new Array(pageSize * 3).fill({}),
							hasNext: true,
							page: 1
						},
					}
				}
			}
		});

		await wrapper.vm.$nextTick();

		assert.isFalse(wrapper.find('.button:disabled').exists());
	});
});