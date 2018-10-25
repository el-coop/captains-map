import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import MarkerBoardersFilter from '@/Components/Utilities/MarkerBordersFilter';
import map from '@/Services/LeafletMapService';
import sinon from 'sinon';


describe('MarkerBoardersFilter.vue', () => {

	let $store;

	beforeEach(() => {
		$store = {
			commit: sinon.spy(),
			dispatch: sinon.spy(),
			state: {
				Markers: {
					markers: [{
						lat: 0,
						lng: 0
					}]
				}
			}
		}
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Renders', () => {
		const wrapper = shallowMount(MarkerBoardersFilter, {
			stubs: {
				'font-awesome-icon': true
			}
		});

		assert.equal(wrapper.findAll('button').length, 2);
		assert.isTrue(wrapper.find('button[disabled]').exists());
	});

	it('Listens for map move end', () => {
		const mapOnStub = sinon.stub(map, 'on');
		shallowMount(MarkerBoardersFilter, {
			stubs: {
				'font-awesome-icon': true
			}
		});

		assert.isTrue(mapOnStub.calledOnce);
		assert.isTrue(mapOnStub.calledWith('moveend'));
	});


	it('Searches only in specific map bounds', () => {
		sinon.stub(map, 'getBorders').returns({
			_southWest: {
				lat: 0,
				lng: 0
			},
			_northEast: {
				lat: 1,
				lng: 1
			}
		});
		const wrapper = shallowMount(MarkerBoardersFilter, {
			stubs: {
				'font-awesome-icon': true
			},
			mocks: {
				$store
			}
		});

		wrapper.find('button').trigger('click');

		assert.isTrue($store.commit.calledOnce);
		assert.isTrue($store.commit.calledWith('Markers/setBorders', [{
			lat: 0,
			lng: 0
		}, {
			lat: 1,
			lng: 1
		}]));
		assert.isTrue($store.dispatch.calledOnce);
		assert.isTrue($store.dispatch.calledWith('Markers/load'));
		assert.equal(wrapper.vm.$data.location, 'current');
		assert.equal(wrapper.find('button[disabled]').text(), 'Only Here');
		assert.equal(wrapper.findAll('button[disabled]').length, 1);
	});

	it('Clears search boundaries', async () => {
		const mapSetViewStub = sinon.stub(map, 'setView');
		const wrapper = shallowMount(MarkerBoardersFilter, {
			stubs: {
				'font-awesome-icon': true
			},
			mocks: {
				$store
			}
		});

		wrapper.setData({
			location: 'current'
		});

		wrapper.findAll('button').at(1).trigger('click');
		await wrapper.vm.$nextTick();

		assert.isTrue($store.commit.calledOnce);
		assert.isTrue($store.commit.calledWith('Markers/setBorders', false));
		assert.isTrue($store.dispatch.calledOnce);
		assert.isTrue($store.dispatch.calledWith('Markers/load'));
		assert.equal(wrapper.vm.$data.location, 'everywhere');
		assert.isTrue(mapSetViewStub.calledOnce);
		assert.isTrue(mapSetViewStub.calledWith([0, 0], 16));
		assert.equal(wrapper.find('button[disabled]').text(), 'Everywhere');
		assert.equal(wrapper.findAll('button[disabled]').length, 1);
	});

	it('Sets location when map moved and state not equal everywhere', () => {
		const wrapper = shallowMount(MarkerBoardersFilter, {
			stubs: {
				'font-awesome-icon': true
			}
		});
		wrapper.setData({
			location: 'current'
		});

		wrapper.vm.onMoveEnd();

		assert.equal(wrapper.vm.$data.location, 'changed');
	});

	it('Doesnt Set location when map moved and state equals everywhere', () => {
		const wrapper = shallowMount(MarkerBoardersFilter, {
			stubs: {
				'font-awesome-icon': true
			}
		});

		wrapper.vm.onMoveEnd();

		assert.equal(wrapper.vm.$data.location, 'everywhere');
	});

});