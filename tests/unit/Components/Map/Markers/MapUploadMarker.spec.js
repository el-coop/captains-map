import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import MapUploadMarker from '@/Components/Map/Markers/MapUploadMarker';
import leaflet from 'leaflet';
import mapService from '@/Services/LeafletMapService';
import sinon from 'sinon';
import UploadFile from "@/Classes/UploadFile";

describe('MapUploadMarker.vue', () => {
	const parent = {
		methods: {
			addObject: sinon.spy(),
			removeObject: sinon.spy()
		}
	};


	let mocks;
	let marker;
	let divIcon;
	let mapObject;

	beforeEach(() => {
		mocks = {
			$store: {
				state: {
					Uploads: {
						workingId: 1
					}
				}
			},
			$bus: {
				$emit: sinon.stub()
			}
		};
		divIcon = {
			firstChild: {
				classList: {
					add: sinon.stub(),
					remove: sinon.stub(),
				}
			}
		};
		mapObject = {
			on: sinon.stub().returnsThis(),
			setLatLng: sinon.stub(),
			getElement: sinon.stub().returns(divIcon),
			setIcon: sinon.stub()
		};
		marker = {
			media: {
				type: 'instagram',
				path: 'https://www.instagram.com/p/path/'
			},
			lat: 0,
			lng: 0,
			type: 'image',
			user: {
				username: 'test'
			},
			uploadTime: 2,
			error: null,
		};
		marker.on = sinon.stub().returns(marker);
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Adds marker to map on creation', (done) => {
		const createIconStub = sinon.stub(leaflet, 'divIcon');
		const createMarkerStub = sinon.stub(leaflet, 'marker').returns(mapObject);
		const wrapper = shallowMount(MapUploadMarker, {
			parentComponent: parent,
			propsData: {
				marker
			},
			mocks
		});

		assert.isTrue(wrapper.find('div').exists());
		assert.isTrue(createIconStub.calledOnce);
		assert.isTrue(createIconStub.calledWith({
			html: wrapper.vm.$el.outerHTML,
			iconSize: ['auto', 'auto']
		}));
		assert.isTrue(createMarkerStub.calledOnce);
		assert.isTrue(parent.methods.addObject.calledOnce);
		assert.isTrue(parent.methods.addObject.calledWith(mapObject));
		assert.isTrue(mapObject.on.calledOnce);
		assert.isTrue(mapObject.on.calledWith('click'));
		setTimeout(()=> {
			assert.isTrue(divIcon.firstChild.classList.add.calledOnce);
			assert.isTrue(divIcon.firstChild.classList.add.calledWith('map__marker--queued'));
			done();
		},10);
	});

	it('Renders instagram marker path', () => {
		sinon.stub(leaflet, 'divIcon');
		sinon.stub(leaflet, 'marker').returns(mapObject);
		const wrapper = shallowMount(MapUploadMarker, {
			parentComponent: parent,
			propsData: {
				marker
			},
			mocks
		});
		assert.isTrue(wrapper.find('img[src="https://instagram.com/p/path/media/"]').exists());
	});

	it('Renders images marker preview', () => {
		const file = new UploadFile('name', 'image');
		marker.media = {
			type: 'image',
			path: '/images/test.jpg',
			files: [
				file
			]
		};
		sinon.stub(leaflet, 'divIcon');
		sinon.stub(leaflet, 'marker').returns(mapObject);
		const wrapper = shallowMount(MapUploadMarker, {
			parentComponent: parent,
			propsData: {
				marker
			},
			mocks
		});
		assert.isTrue(wrapper.find(`img[src="${file.preview}"]`).exists());
	});

	it('Renders the object with error status', (done) => {
		sinon.stub(leaflet, 'divIcon');
		sinon.stub(leaflet, 'marker').returns(mapObject);

		marker.error = {
			status: 500
		};
		shallowMount(MapUploadMarker, {
			parentComponent: parent,
			propsData: {
				marker,
			},
			mocks
		});

		setTimeout(()=> {
			assert.isTrue(divIcon.firstChild.classList.add.calledOnce);
			assert.isTrue(divIcon.firstChild.classList.add.calledWith('map__marker--error'));
			done();
		},10);
	});

	it('Sets marker to upload when it is being worked', (done) => {
		sinon.stub(leaflet, 'divIcon');
		sinon.stub(leaflet, 'marker').returns(mapObject);

		const wrapper = shallowMount(MapUploadMarker, {
			parentComponent: parent,
			propsData: {
				marker,
			},
			mocks
		});

		mocks.$store.state.Uploads.workingId = 2;

		setTimeout(()=>{
			assert.isTrue(divIcon.firstChild.classList.add.calledTwice);
			assert.isTrue(divIcon.firstChild.classList.add.firstCall.calledWith('map__marker--queued'));
			assert.isTrue(divIcon.firstChild.classList.add.secondCall.calledWith('map__marker--uploading'));
			done();
		}, 10)
	});

	it('Changes marker image when updated', async () => {
		sinon.stub(leaflet, 'marker').returns(mapObject);
		const marker2 = {
			media: {
				type: 'image',
				path: '/images/test.jpg',
				files: [
					new UploadFile('name', 'image')
				]
			},
			lat: 0,
			lng: 0,
			type: 'image',
			user: {
				username: 'test'
			},
			uploadTime: 2,
			error: null,
		};

		const wrapper = shallowMount(MapUploadMarker, {
			parentComponent: parent,
			propsData: {
				marker,
			},
			mocks
		});

		wrapper.setProps({
			marker: marker2
		});

		await wrapper.vm.$nextTick();

		assert.isTrue(mapObject.setIcon.calledOnce);
		assert.isTrue(mapObject.setIcon.calledWith(leaflet.divIcon({
			html: wrapper.html(),
			iconSize: ['auto', 'auto']
		})));
	});

	it('Removes marker when destroyed', () => {
		sinon.stub(leaflet, 'marker').returns(mapObject);
		sinon.stub(mapService, 'addObject');

		const wrapper = shallowMount(MapUploadMarker, {
			parentComponent: parent,
			propsData: {
				marker
			},
			mocks
		});

		wrapper.setData({
			mapObject
		});

		wrapper.destroy();
		assert.isTrue(parent.methods.removeObject.calledOnce);
		assert.isTrue(parent.methods.removeObject.calledWith(mapObject));
	});

	it('Emit events when clicks on errored marker', () => {
		marker.error = {
			status: 500
		};
		sinon.stub(leaflet, 'marker').returns(mapObject);

		const wrapper = shallowMount(MapUploadMarker, {
			parentComponent: parent,
			mocks,
			propsData: {
				marker
			}
		});

		wrapper.vm.onClick();
		assert.isTrue(mocks.$bus.$emit.calledOnce);
		assert.isTrue(mocks.$bus.$emit.calledWith('map-create-marker', {
			lat: 0,
			lng: 0,
			marker: marker
		}));
	});

	it('Doesnt emit events when clicks on queued marker', () => {

		sinon.stub(leaflet, 'marker').returns(mapObject);

		const wrapper = shallowMount(MapUploadMarker, {
			parentComponent: parent,
			mocks,
			propsData: {
				marker
			}
		});

		wrapper.vm.onClick();
		assert.isFalse(mocks.$bus.$emit.called);

	});
});
