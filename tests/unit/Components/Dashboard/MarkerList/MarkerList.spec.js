import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import MarkerList from '@/Components/Dashboard/SideBar/MarkerList';
import sinon from 'sinon';
import Map from '@/Services/LeafletMapService';

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
							page: 0,
							serverPage: 0
						},
					}
				}
			}
		});

		assert.isTrue(wrapper.find('ul').exists());
		assert.isFalse(wrapper.find('.loader').exists());
	});

	it('Shows loader when loading', () => {
		const wrapper = shallowMount(MarkerList, {
			mocks: {
				$store: {
					state: {
						Markers: {
							markers: [],
							hasNext: false,
							page: 0,
							loading: true,
							serverPage: 0
						},
					}
				}
			}
		});

		assert.isFalse(wrapper.find('ul').exists());
		assert.isTrue(wrapper.find('.loader').exists());
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
							page: 0,
							serverPage: 0
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
							page: 0,
							serverPage: 0
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
							page: 2,
							serverPage: 0
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
							page: 2,
							serverPage: 0
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
							page: 0,
							serverPage: 0
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
							page: 1,
							serverPage: 0
						},
					}
				}
			}
		});

		await wrapper.vm.$nextTick();

		assert.isFalse(wrapper.find('.button:disabled').exists());
	});

	it('Enables previous button when page is 0 and server page is bigger', async () => {
		const wrapper = shallowMount(MarkerList, {
			mocks: {
				$store: {
					state: {
						Markers: {
							markers: new Array(pageSize * 3).fill({}),
							hasNext: true,
							page: 0,
							serverPage: 2
						},
					}
				}
			}
		});

		await wrapper.vm.$nextTick();

		assert.isFalse(wrapper.find('.button:disabled').exists());
	});

	it('Loads next page', async () => {
		const storeDispatchSpy = sinon.spy();
		const mapSetViewStub = sinon.stub(Map, 'setView');
		const wrapper = shallowMount(MarkerList, {
			mocks: {
				$store: {
					state: {
						Markers: {
							markers: new Array(pageSize * 3).fill({lat: 0, lng: 0}),
							hasNext: true,
							page: 1,
							serverPage: 0
						},
					},
					dispatch: storeDispatchSpy
				}
			}
		});

		await wrapper.vm.nextPage();
		assert.isTrue(storeDispatchSpy.calledOnce);
		assert.isTrue(storeDispatchSpy.calledWith('Markers/nextPage'));
		assert.isTrue(mapSetViewStub.calledOnce);
		assert.isTrue(mapSetViewStub.calledWith([0, 0], 16));
	});

	it('Loads prev page', async () => {
		const storeDispatchSpy = sinon.spy();
		const mapSetViewStub = sinon.stub(Map, 'setView');
		const wrapper = shallowMount(MarkerList, {
			mocks: {
				$store: {
					state: {
						Markers: {
							markers: new Array(pageSize * 3).fill({lat: 0, lng: 0}),
							hasNext: true,
							page: 1,
							serverPage: 0
						},
					},
					dispatch: storeDispatchSpy
				}
			}
		});

		await wrapper.vm.previousPage();
		assert.isTrue(storeDispatchSpy.calledOnce);
		assert.isTrue(storeDispatchSpy.calledWith('Markers/previousPage'));
		assert.isTrue(mapSetViewStub.calledOnce);
		assert.isTrue(mapSetViewStub.calledWith([0, 0], 16));
	});

	it('Calls nextPage on click', () => {
		const nextPageStub = sinon.stub(MarkerList.methods, 'nextPage');
		const wrapper = shallowMount(MarkerList, {
			mocks: {
				$store: {
					state: {
						Markers: {
							markers: new Array(pageSize * 3).fill({lat: 0, lng: 0}),
							hasNext: true,
							page: 1,
							serverPage: 0
						},
					}
				}
			}
		});

		wrapper.findAll('.button').at(1).trigger('click');
		assert.isTrue(nextPageStub.calledOnce);
	});

	it('Calls previousPage on click', () => {
		const previousPageStub = sinon.stub(MarkerList.methods, 'previousPage');
		const wrapper = shallowMount(MarkerList, {
			mocks: {
				$store: {
					state: {
						Markers: {
							markers: new Array(pageSize * 3).fill({lat: 0, lng: 0}),
							hasNext: true,
							page: 1,
							serverPage: 0
						},
					}
				}
			}
		});

		wrapper.findAll('.button').at(0).trigger('click');
		assert.isTrue(previousPageStub.calledOnce);
	});
});