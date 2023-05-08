import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import {shallowMount} from '@vue/test-utils';
import MapUploadMarker from '@/Components/Map/Markers/MapUploadMarker.vue';
import leaflet from 'leaflet';
import mapService from '@/Services/LeafletMapService';
import sinon from 'sinon';
import UploadFile from "@/Classes/UploadFile";
import {createStore} from "vuex";

describe('MapUploadMarker.vue', () => {
	const parent = {
		methods: {
			addObject: sinon.spy(),
			removeObject: sinon.spy()
		}
	};


	let marker;
	let divIcon;
	let mapObject;
	let storeOptions;
	let stubs = {
		FontAwesomeIcon: true
	};

	beforeEach(() => {

		storeOptions = {
			modules: {
				Uploads: {
					namespaced: true,
					state: {
						workingId: 1
					},
					mutations: {
						markAsWorking(state, id) {
							state.workingId = id;
						},
					}
				}
			},
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
		marker.getElement = sinon.stub();
		marker.setIcon = sinon.stub();
		marker.setLatLng = sinon.stub();
		marker.on = sinon.stub().returns(marker);
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Adds marker to map on creation', async () => {
		const createIconStub = sinon.stub(leaflet, 'divIcon');
		const createMarkerStub = sinon.stub(leaflet, 'marker').returns(mapObject);
		const wrapper = shallowMount(MapUploadMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			},
			props: {
				marker
			},
		});

		expect(wrapper.find('div').exists()).toBeTruthy();
		expect(createIconStub.calledOnce).toBeTruthy();
		expect(createIconStub.calledWith({
			html: wrapper.vm.$el.outerHTML,
			iconSize: ['auto', 'auto']
		})).toBeTruthy();
		expect(createMarkerStub.calledOnce).toBeTruthy();
		expect(wrapper.emitted()).toHaveProperty('add-to-map');
		const addToMapEvent = wrapper.emitted('add-to-map');
		expect(addToMapEvent[0]).toEqual([mapObject]);
		expect(mapObject.on.calledOnce).toBeTruthy();
		expect(mapObject.on.calledWith('click')).toBeTruthy();

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 10);
		});

		expect(divIcon.firstChild.classList.add.calledOnce).toBeTruthy();
		expect(divIcon.firstChild.classList.add.calledWith('map__marker--queued')).toBeTruthy();
	});

	it('Renders instagram marker path', () => {
		sinon.stub(leaflet, 'divIcon');
		sinon.stub(leaflet, 'marker').returns(mapObject);
		const wrapper = shallowMount(MapUploadMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			},
			props: {
				marker
			},
		});
		console.log(wrapper.html());
		expect(wrapper.find('img[src="/api/marker/instagram/p/path"]').exists()).toBeTruthy();
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
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			},
			props: {
				marker
			},
		});

		expect(wrapper.find(`img[src="${file.preview}"]`).exists()).toBeTruthy();
	});

	it('Renders the object with error status', async () => {
		sinon.stub(leaflet, 'divIcon');
		sinon.stub(leaflet, 'marker').returns(mapObject);

		marker.error = {
			status: 500
		};
		const wrapper = shallowMount(MapUploadMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			},
			props: {
				marker
			},
		});

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 20);
		});

		expect(divIcon.firstChild.classList.add.calledOnce).toBeTruthy();
		expect(divIcon.firstChild.classList.add.calledWith('map__marker--error')).toBeTruthy();
	});

	it('Sets marker to upload when it is being worked', async () => {
		sinon.stub(leaflet, 'divIcon');
		sinon.stub(leaflet, 'marker').returns(mapObject);
		const mockStore = createStore(storeOptions);

		const wrapper = shallowMount(MapUploadMarker, {
			global: {
				plugins: [mockStore],
				stubs
			},
			props: {
				marker
			},
		});

		mockStore.commit('Uploads/markAsWorking',2);

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 10);
		});

		expect(divIcon.firstChild.classList.add.calledTwice).toBeTruthy();
		expect(divIcon.firstChild.classList.add.firstCall.calledWith('map__marker--queued')).toBeTruthy();
		expect(divIcon.firstChild.classList.add.secondCall.calledWith('map__marker--uploading')).toBeTruthy();

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
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			},
			props: {
				marker
			},
		});

		await wrapper.setProps({
			marker: marker2
		});

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 10);
		});

		expect(mapObject.setIcon.calledOnce).toBeTruthy();

		expect(mapObject.setIcon.calledWith(leaflet.divIcon({
			html: wrapper.vm.$el.outerHTML,
			iconSize: ['auto', 'auto']
		}))).toBeTruthy();
	});

	it('Removes marker when destroyed',async () => {
		sinon.stub(leaflet, 'marker').returns(mapObject);
		sinon.stub(mapService, 'addObject');

		const wrapper = shallowMount(MapUploadMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			},
			props: {
				marker
			},
		});

		await wrapper.setData({
			mapObject
		});

		wrapper.unmount();
		expect(wrapper.emitted()).toHaveProperty('remove-from-map');
		const removeFromMapEvent = wrapper.emitted('remove-from-map');
		expect(removeFromMapEvent[0]).toEqual([mapObject]);
	});

	it('Emit events when clicks on errored marker', () => {
		marker.error = {
			status: 500
		};
		sinon.stub(leaflet, 'marker').returns(mapObject);

		const wrapper = shallowMount(MapUploadMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			},
			props: {
				marker
			},
		});

		wrapper.vm.onClick();


		expect(wrapper.emitted()).toHaveProperty('map-create-marker');
		const mapCreateMarkerEvent = wrapper.emitted('map-create-marker');
		expect(mapCreateMarkerEvent[0]).toEqual([{
			latlng: {
				lat: 0,
				lng: 0,
			},
			marker: marker
		}]);

	});

	it('Doesnt emit events when clicks on queued marker', () => {

		sinon.stub(leaflet, 'marker').returns(mapObject);

		const wrapper = shallowMount(MapUploadMarker, {
			global: {
				plugins: [createStore(storeOptions)],
				stubs
			},
			props: {
				marker
			},
		});

		wrapper.vm.onClick();
		expect(wrapper.emitted()).not.toHaveProperty('map-create-marker');

	});
});
