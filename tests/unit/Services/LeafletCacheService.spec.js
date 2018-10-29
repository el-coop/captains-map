import sinon from 'sinon';
import { assert } from 'chai';
import LeafletCacheService from '@/Services/LeafletCacheService';
import { tileLayer, geocoder } from '@/Settings/leaflet.settings';


describe('Map Cache Service', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('Caches tiles');
});