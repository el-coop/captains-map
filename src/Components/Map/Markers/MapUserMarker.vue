<template>
	<div class="map__user-marker map__marker" @click="onClick">
		<MapUserAccuracyMarker v-if="! isOld && accuracy !== null && lat !== null && lng !== null" :accuracy="accuracy"
							   :lat="lat"
                               @user-marker-click="$emit(event, $event)"
							   :lng="lng"/>
	</div>
</template>

<script>
	import MapObjectMixin from '@/Components/Map/MapObjectMixin.vue';
	import UserMarkerMixin from '@/Components/Map/Markers/MapUserMarkerMixin.vue';
	import Map from '@/Services/LeafletMapService';
	import MapUserAccuracyMarker from "@/Components/Map/Markers/MapUserAccuracyMarker.vue";

	export default {
		name: "MapUserMarker",
		components: {MapUserAccuracyMarker},
		mixins: [MapObjectMixin, UserMarkerMixin],
        emits:['user-marker-click'],
		data() {
			return {
				lat: null,
				lng: null,
				accuracy: 100,
				iconSize: 20,
				timestamp: 0,
				isOld: false,
				checkOldInterval: null
			}
		},
  
		beforeUnmount() {
			clearInterval(this.checkOldInterval);
			Map.stopLocate();
		},

		methods: {
			setUp() {
				Map.watchLocation(this.setLocation.bind(this));
			},

			setLocation(location) {
				if (!this.checkOldInterval) {
					this.checkOldInterval = setInterval(this.checkIfOld.bind(this), 60 * 1000);
				}
				this.accuracy = location.accuracy;
				this.timestamp = location.timestamp;

				if (!location.latlng || (this.lat === location.latlng.lat && this.lng === location.latlng.lng)) {
					return;
				}

				this.lat = location.latlng.lat;
				this.lng = location.latlng.lng;

				if (!this.mapObject) {
					if (document.querySelector('#geolocation-notification')) {
						this.$toast.hide('#geolocation-notification');
					}
					this.$toast.info('You can now go to your location by holding the location icon. (right click on desktop)', '');
					this.prepareMapObject(location.latlng.lat, location.latlng.lng);
					this.addToMap();
				}
				this.setLatLng(this.lat, this.lng);
				this.checkIfOld();
			},
			addObject(marker) {
				this.$parent.addObject(marker);
			},

			removeObject(marker) {
				this.$parent.removeObject(marker);
			},

			goToMarker() {
				if (this.lat) {
					Map.setView([this.lat, this.lng]);
				}
			},

			checkIfOld() {
				if (this.timestamp < (Date.now() - 5 * 60 * 1000)) {
					this.addClass('map__user-marker--old');
					this.isOld = true;
				} else {
					this.removeClass('map__user-marker--old');
					this.isOld = false;
					window.clearInterval(this.checkOldInterval);
				}
			}
		},
	}
</script>
