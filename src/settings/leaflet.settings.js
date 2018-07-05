import leaflet from 'leaflet';

import markerIcon from '@/assets/images/marker-icon-2x.png';
import shadowIcon from '@/assets/images/marker-shadow.png';


export let defaultIcon = leaflet.icon({
	iconUrl: markerIcon,
	shadowUrl: shadowIcon,
});