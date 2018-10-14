import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import MarkerCluster from '@/Components/Map/Layers/MarkerCluster';
import sinon from 'sinon';
import leaflet from 'leaflet';

describe('MarkerCluster.vue', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('Renders', () => {
		const parent = {
			methods: {
				addObject: sinon.spy()
			}
		};
		leaflet.markerClusterGroup = sinon.spy();
		const wrapper = shallowMount(MarkerCluster, {
			parentComponent: parent
		});

		assert.isTrue(wrapper.find('.map__marker').exists());
	});

	it('creates markerCluster', () => {

		const cluster = {
			addLayer: sinon.spy()
		};
		const parent = {
			methods: {
				addObject: sinon.spy()
			}
		};
		leaflet.markerClusterGroup = sinon.stub().returns(cluster);

		shallowMount(MarkerCluster, {
			parentComponent: parent
		});



		assert.isTrue(leaflet.markerClusterGroup.calledOnce);
		assert.isTrue(parent.methods.addObject.calledOnce);
		assert.isTrue(parent.methods.addObject.calledWith(cluster));
	});

	it('Adds marker to cluster', () => {
		const cluster = {
			addLayer: sinon.spy()
		};
		const parent = {
			methods: {
				addObject: sinon.spy()
			}
		};
		const marker = {};
		leaflet.markerClusterGroup = sinon.stub().returns(cluster);

		const wrapper = shallowMount(MarkerCluster, {
			parentComponent: parent
		});

		wrapper.vm.addObject(marker);


		assert.isTrue(cluster.addLayer.calledOnce);
		assert.isTrue(cluster.addLayer.calledWith(marker));
	});

	it('Queues adding markers when no object', () => {
		const cluster = {
			addLayer: sinon.spy()
		};
		const parent = {
			methods: {
				addObject: sinon.spy()
			}
		};
		const marker = {};
		leaflet.markerClusterGroup = sinon.stub().returns(cluster);

		const wrapper = shallowMount(MarkerCluster, {
			parentComponent: parent
		});

		wrapper.vm.mapObject = null;

		wrapper.vm.addObject(marker);


		assert.equal(wrapper.vm.queue.length,1);
		assert.deepEqual(wrapper.vm.queue[0],marker);
	});

	it('Removes layer from cluster', () => {
		const cluster = {
			removeLayer: sinon.spy()
		};
		const parent = {
			methods: {
				addObject: sinon.spy()
			}
		};
		const marker = {};
		leaflet.markerClusterGroup = sinon.stub().returns(cluster);

		const wrapper = shallowMount(MarkerCluster, {
			parentComponent: parent
		});

		wrapper.vm.removeObject(marker);


		assert.isTrue(cluster.removeLayer.calledOnce);
		assert.isTrue(cluster.removeLayer.calledWith(marker));
	});

	it('Removes control when destroyed', () => {
		const parent = {
			methods: {
				addObject: sinon.spy(),
				removeObject: sinon.spy(),
			}
		};
		const wrapper = shallowMount(MarkerCluster, {
			parentComponent: parent,
		});

		wrapper.destroy();
		assert.isTrue(parent.methods.removeObject.calledOnce);
		assert.isTrue(parent.methods.removeObject.calledWith(wrapper.vm.mapObject));
	});

	it('Generates icon',() => {
		const cluster = {
			getChildCount: sinon.stub().returns(2),
			getAllChildMarkers: sinon.stub().returns([{
				id: 0,
				options: {
					icon: {
						options: {
							html: '0'
						}
					}
				}
			},{
				id: 1,
				options: {
					icon: {
						options: {
							html: '1'
						}
					}
				}

			}])
		};
		const parent = {
			methods: {
				addObject: sinon.spy(),
			}
		};
		const divIconStub = sinon.stub(leaflet,'divIcon');
		const wrapper = shallowMount(MarkerCluster, {
			parentComponent: parent,
		});

		wrapper.vm.createIcon(cluster);

		assert.isTrue(divIconStub.calledOnce);
		assert.isTrue(divIconStub.calledWith({
			html: `<div class="map__cluster-wrapper">1` +
				`<span class="map__cluster-wrapper-counter">2</span>` +
				`</div>`,
			iconSize: ['auto', 'auto']
		}));


	});

});
